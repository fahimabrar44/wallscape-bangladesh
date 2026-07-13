import { FastifyRequest, FastifyReply } from 'fastify';
import { Project } from '../models';
import { projectSchema } from '../schemas';
import { generateSlug } from '../utils/helpers';

export async function getProjects(request: FastifyRequest, reply: FastifyReply) {
  const { isPublished } = request.query as any;
  const filter: any = {};
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  const projects = await Project.find(filter).sort({ createdAt: -1 });
  reply.send({ projects });
}

export async function getProject(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as any;
  const project = await Project.findOne({ slug, isPublished: true });
  if (!project) {
    reply.status(404).send({ message: 'Project not found' });
    return;
  }
  reply.send({ project });
}

export async function createProject(request: FastifyRequest, reply: FastifyReply) {
  const data = projectSchema.parse(request.body);
  const slug = generateSlug(data.title);
  const project = await Project.create({
    ...data,
    slug,
    completionDate: data.completionDate ? new Date(data.completionDate) : undefined,
  });
  reply.status(201).send({ project });
}

export async function updateProject(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  if (data.title) data.slug = generateSlug(data.title);
  if (data.completionDate) data.completionDate = new Date(data.completionDate);
  const project = await Project.findByIdAndUpdate(id, data, { new: true });
  if (!project) {
    reply.status(404).send({ message: 'Project not found' });
    return;
  }
  reply.send({ project });
}

export async function deleteProject(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Project.findByIdAndDelete(id);
  reply.send({ message: 'Project deleted successfully' });
}
