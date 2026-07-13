import { FastifyRequest, FastifyReply } from 'fastify';
import { Notification } from '../models';

export async function submitContactForm(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, phone, subject, message } = request.body as any;

  await Notification.create({
    type: 'contact',
    title: `Contact Form: ${subject}`,
    message: `From: ${name} (${email}, ${phone})\n${message}`,
  });

  reply.send({ message: 'Thank you for your message. We will get back to you soon.' });
}
