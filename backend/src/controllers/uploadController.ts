import { FastifyRequest, FastifyReply } from 'fastify';

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();
  if (!file) {
    reply.status(400).send({ message: 'No file uploaded' });
    return;
  }

  const buffer = await file.toBuffer();
  const filename = `${Date.now()}-${file.filename}`;
  const fs = await import('fs/promises');
  const path = await import('path');
  const uploadDir = path.join(__dirname, '../../uploads');

  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${filename}`;
  reply.status(201).send({ url, filename });
}

export async function uploadMultipleImages(request: FastifyRequest, reply: FastifyReply) {
  const files = request.files();
  const urls: string[] = [];
  const fs = await import('fs/promises');
  const path = await import('path');
  const uploadDir = path.join(__dirname, '../../uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  for await (const file of files) {
    const buffer = await file.toBuffer();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.filename}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    urls.push(`/uploads/${filename}`);
  }

  reply.status(201).send({ urls });
}

export async function deleteImage(request: FastifyRequest, reply: FastifyReply) {
  const { filename } = request.params as any;
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(__dirname, '../../uploads', filename);
  try {
    await fs.unlink(filePath);
    reply.send({ message: 'Image deleted successfully' });
  } catch {
    reply.status(404).send({ message: 'Image not found' });
  }
}
