import { FastifyRequest, FastifyReply } from 'fastify';
import { Order, Customer, Product, Notification } from '../models';
import { orderSchema } from '../schemas';
import { generateOrderNumber, paginate } from '../utils/helpers';

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  const data = orderSchema.parse(request.body);
  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    ...data,
    orderNumber,
    orderStatus: 'pending',
    paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'pending',
  });

  for (const item of data.items) {
    await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity, totalSold: item.quantity } });
  }

  const customerData: any = {
    name: data.customer.name,
    phone: data.customer.phone,
    email: data.customer.email || undefined,
    address: `${data.shippingAddress.fullAddress}, ${data.shippingAddress.area}, ${data.shippingAddress.district}, ${data.shippingAddress.division}`,
    totalOrders: 1,
    totalPurchase: data.grandTotal,
    lastOrderDate: new Date(),
  };

  const existingCustomer = await Customer.findOne({ phone: data.customer.phone });
  if (existingCustomer) {
    await Customer.findByIdAndUpdate(existingCustomer._id, {
      $inc: { totalOrders: 1, totalPurchase: data.grandTotal },
      lastOrderDate: new Date(),
      name: data.customer.name,
      email: data.customer.email || existingCustomer.email,
      address: customerData.address,
    });
  } else {
    await Customer.create(customerData);
  }

  await Notification.create({
    type: 'new_order',
    title: 'New Order Received',
    message: `Order ${orderNumber} placed by ${data.customer.name}`,
    link: `/admin/orders/${order._id}`,
  });

  reply.status(201).send({ order });
}

export async function trackOrder(request: FastifyRequest, reply: FastifyReply) {
  const { orderNumber, phone } = request.query as any;
  if (!orderNumber && !phone) {
    reply.status(400).send({ message: 'Provide order number or phone number' });
    return;
  }
  const filter: any = {};
  if (orderNumber) filter.orderNumber = orderNumber;
  if (phone) filter['customer.phone'] = phone;

  const order = await Order.findOne(filter).sort({ createdAt: -1 });
  if (!order) {
    reply.status(404).send({ message: 'Order not found' });
    return;
  }
  reply.send({ order });
}

export async function getOrders(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as any;
  const { skip, limit, page } = paginate(parseInt(query.page) || 1, parseInt(query.limit) || 20);
  const filter: any = {};
  if (query.status) filter.orderStatus = query.status;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.search) {
    filter.$or = [
      { orderNumber: { $regex: query.search, $options: 'i' } },
      { 'customer.name': { $regex: query.search, $options: 'i' } },
      { 'customer.phone': { $regex: query.search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  reply.send({
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const order = await Order.findById(id).populate('items.productId', 'name images');
  if (!order) {
    reply.status(404).send({ message: 'Order not found' });
    return;
  }
  reply.send({ order });
}

export async function updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const { orderStatus, internalNotes, cancelReason } = request.body as any;

  const update: any = { orderStatus };
  if (internalNotes !== undefined) update.internalNotes = internalNotes;
  if (cancelReason !== undefined) update.cancelReason = cancelReason;

  if (orderStatus === 'delivered') {
    update.deliveredAt = new Date();
  }
  if (orderStatus === 'cancelled') {
    update.cancelledAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) {
    reply.status(404).send({ message: 'Order not found' });
    return;
  }
  reply.send({ order });
}

export async function verifyPayment(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const { paymentStatus } = request.body as any;

  const update: any = { paymentStatus };
  if (paymentStatus === 'verified') {
    update.isPaid = true;
    update.paidAt = new Date();
  }

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) {
    reply.status(404).send({ message: 'Order not found' });
    return;
  }
  reply.send({ order });
}

export async function getDashboardStats(_request: FastifyRequest, reply: FastifyReply) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    deliveredOrders,
    revenueResult,
    recentOrders,
    bestSellers,
    lowStock,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(10),
    Product.find({ isActive: true }).sort({ totalSold: -1 }).limit(10),
    Product.find({ stock: { $lte: 10 }, isActive: true }).limit(10),
  ]);

  reply.send({
    stats: {
      totalOrders,
      todayOrders,
      pendingOrders,
      deliveredOrders,
      monthlyRevenue: revenueResult[0]?.total || 0,
    },
    recentOrders,
    bestSellers,
    lowStock,
  });
}
