import { FastifyRequest, FastifyReply } from 'fastify';
import { Setting } from '../models';

export async function getSettings(_request: FastifyRequest, reply: FastifyReply) {
  const settings = await Setting.find();
  const settingsMap: Record<string, any> = {};
  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });
  reply.send({ settings: settingsMap });
}

export async function updateSettings(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body as Record<string, any>;
  const operations = Object.entries(data).map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { key, value } },
      upsert: true,
    },
  }));
  await Setting.bulkWrite(operations);
  reply.send({ message: 'Settings updated successfully' });
}

export async function getSetting(request: FastifyRequest, reply: FastifyReply) {
  const { key } = request.params as any;
  const setting = await Setting.findOne({ key });
  if (!setting) {
    reply.status(404).send({ message: 'Setting not found' });
    return;
  }
  reply.send({ setting });
}
