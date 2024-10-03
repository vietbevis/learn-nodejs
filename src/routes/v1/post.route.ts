import { validateRequest } from '@/middlewares/validateRequest'
import PostController from '@/controllers/post.controller'
import asyncHandler from '@/middlewares/asyncHandler'
import express from 'express'
import PostPaginationSchema from '@/validations/post.schema'

const PostRouter = express.Router()

PostRouter.get(
  '/',
  validateRequest({ query: PostPaginationSchema }),
  asyncHandler(PostController.findAll)
)
PostRouter.get('/:id', asyncHandler(PostController.findById))
PostRouter.post('/', asyncHandler(PostController.create))
PostRouter.put('/:id', asyncHandler(PostController.update))
PostRouter.delete('/:id', asyncHandler(PostController.delete))

export default PostRouter
