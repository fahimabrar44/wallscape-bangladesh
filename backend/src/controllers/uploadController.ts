import { FastifyRequest, FastifyReply } from 'fastify';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export async function getUploadSignature(request: FastifyRequest, reply: FastifyReply) {
  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, any> = { timestamp, folder: 'wallscape' };
  const signature = cloudinary.utils.api_sign_request(params, config.cloudinary.apiSecret);
  reply.send({
    signature,
    timestamp,
    cloudName: config.cloudinary.cloudName,
    apiKey: config.cloudinary.apiKey,
    folder: 'wallscape',
  });
}

export async function uploadImage(request: FastifyRequest, reply: FastifyReply) {
  const file = await request.file();
  if (!file) {
    reply.status(400).send({ message: 'No file uploaded' });
    return;
  }

  const buffer = await file.toBuffer();
  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'wallscape', resource_type: 'image' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

  reply.status(201).send({ url: result.secure_url, publicId: result.public_id });
}

export async function uploadMultipleImages(request: FastifyRequest, reply: FastifyReply) {
  const files = request.files();
  const urls: string[] = [];
  for await (const file of files) {
    const buffer = await file.toBuffer();
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'wallscape', resource_type: 'image' },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
    urls.push(result.secure_url);
  }
  reply.status(201).send({ urls });
}

export async function deleteImage(request: FastifyRequest, reply: FastifyReply) {
  const { publicId } = request.params as any;
  await cloudinary.uploader.destroy(publicId);
  reply.send({ message: 'Image deleted successfully' });
}
