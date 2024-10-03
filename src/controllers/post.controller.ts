import { CreatedResponse } from '@/core/success.response'
import PostService from '@/services/post.service'
import { PostPaginationType } from '@/validations/post.schema'
import { RequestHandler } from 'express'
import { ReasonPhrases } from 'http-status-codes'

interface IPostController {
  findAll: RequestHandler<unknown, unknown, unknown, PostPaginationType>
  findById: RequestHandler
  create: RequestHandler
  update: RequestHandler
  delete: RequestHandler
}

const PostController: IPostController = {
  async findAll(req, res) {
    const posts = await PostService.findAll(req.query)
    new CreatedResponse(ReasonPhrases.OK, posts).send(res)
  },
  async findById(req, res) {
    new CreatedResponse('Get By Id', {}).send(res)
  },
  async create(req, res) {
    new CreatedResponse('Create Post', {}).send(res)
  },
  async update(req, res) {
    new CreatedResponse('Update Post', {}).send(res)
  },
  async delete(req, res) {
    new CreatedResponse('Delete Post', {}).send(res)
  }
}

export default PostController
