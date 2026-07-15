import { FastifyRequest, FastifyReply } from 'fastify';
import { Admin, Notification } from '../models';
import { loginSchema } from '../schemas';

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = loginSchema.parse(request.body);

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    reply.status(401).send({ message: 'Invalid email or password' });
    return;
  }

  if (!admin.isActive) {
    reply.status(403).send({ message: 'Account is deactivated' });
    return;
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = await reply.jwtSign({ id: admin._id, role: admin.role });

  reply.send({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
    },
  });
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  reply.send({ admin: request.admin });
}

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const { name, email } = request.body as any;
  const admin = await Admin.findByIdAndUpdate(
    request.admin!._id,
    { name, email },
    { new: true }
  ).select('-password');
  reply.send({ admin });
}

export async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  const { currentPassword, newPassword } = request.body as any;
  const admin = await Admin.findById(request.admin!._id);
  if (!admin || !(await admin.comparePassword(currentPassword))) {
    reply.status(400).send({ message: 'Current password is incorrect' });
    return;
  }
  admin.password = newPassword;
  await admin.save();
  reply.send({ message: 'Password updated successfully' });
}

export async function createAdmin(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password, role, permissions } = request.body as any;
  const existing = await Admin.findOne({ email });
  if (existing) {
    reply.status(400).send({ message: 'Admin with this email already exists' });
    return;
  }
  const admin = await Admin.create({ name, email, password, role, permissions });
  reply.status(201).send({ admin });
}

export async function getAdmins(_request: FastifyRequest, reply: FastifyReply) {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  reply.send({ admins });
}

export async function updateAdmin(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const updates = request.body as any;
  if (updates.password) {
    const admin = await Admin.findById(id);
    if (admin) {
      admin.password = updates.password;
      await admin.save();
    }
    delete updates.password;
  }
  const admin = await Admin.findByIdAndUpdate(id, updates, { new: true }).select('-password');
  if (!admin) {
    reply.status(404).send({ message: 'Admin not found' });
    return;
  }
  reply.send({ admin });
}

export async function deleteAdmin(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Admin.findByIdAndDelete(id);
  reply.send({ message: 'Admin deleted successfully' });
}
