import { UnauthorizedError } from '@/core/error.response'
import { CreatedResponse } from '@/core/success.response'
import { TPost } from '@/models/post.model'
import PostService from '@/services/post.service'
import { omitFields } from '@/utils/dto'
import {
  FormCreatePostType,
  PostPaginationType
} from '@/validations/post.schema'
import { RequestHandler } from 'express'
import { ReasonPhrases } from 'http-status-codes'

interface IPostController {
  findAll: RequestHandler<unknown, unknown, unknown, PostPaginationType>
  findById: RequestHandler
  create: RequestHandler<unknown, unknown, FormCreatePostType, unknown>
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
    const post = await PostService.create({
      ...req.body,
      userId: req.user._id
    })
    console.log('🚀 ~ create ~ post:', post)
    new CreatedResponse(
      'Create Post',
      omitFields(post, ['updatedBy', 'status'])
    ).send(res)
  },
  async update(req, res) {
    new CreatedResponse('Update Post', {}).send(res)
  },
  async delete(req, res) {
    new CreatedResponse('Delete Post', {}).send(res)
  }
}

export default PostController
