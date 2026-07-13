import { FastifyRequest, FastifyReply } from 'fastify';
import { Notification } from '../models';

export async function getNotifications(_request: FastifyRequest, reply: FastifyReply) {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
  const unreadCount = await Notification.countDocuments({ isRead: false });
  reply.send({ notifications, unreadCount });
}

export async function markAsRead(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Notification.findByIdAndUpdate(id, { isRead: true });
  reply.send({ message: 'Notification marked as read' });
}

export async function markAllAsRead(_request: FastifyRequest, reply: FastifyReply) {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  reply.send({ message: 'All notifications marked as read' });
}
