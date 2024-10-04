import postModel from '@/models/post.model'
import { ObjectId } from 'mongoose'
import {
  EPagination,
  ESortDirection,
  ESortPostField,
  EStatus
} from '@/constants/enums'
import {
  FormCreatePostType,
  PostPaginationType
} from '@/validations/post.schema'
import Database from '@/config/mongodb'
import DatabaseTransaction from '@/utils/helpers/database.transaction'

const dbTransaction = new DatabaseTransaction()

interface IPostService {
  findAll: ({
    page,
    limit,
    sortField,
    sortDirection,
    status
  }: PostPaginationType) => Promise<any>
  findById: (_id: ObjectId) => Promise<any>
  create: (body: FormCreatePostType & { userId: string }) => Promise<any>
  update: () => Promise<any>
  delete: () => Promise<any>
}

const PostService: IPostService = {
  findAll: async ({
    page = EPagination.PAGE,
    limit = EPagination.LIMIT,
    sortField = ESortPostField.CREATED_AT,
    sortDirection = ESortDirection.DESC,
    status = EStatus.PUBLIC
  }) => {
    const query = { status }

    const options = {
      page,
      limit,
      sort: { [sortField]: sortDirection === ESortDirection.ASC ? 1 : -1 },
      select: '-updatedBy -status',
      populate: {
        path: 'createdBy',
        select: 'fullName'
      }
    }

    return postModel.paginate(query, options)
  },
  findById: async (_id) => {
    return postModel.findById(_id)
  },
  create: async ({
    content,
    images = [],
    status = [EStatus.PUBLIC],
    userId
  }) => {
    // Sử dụng helper `withTransaction` để quản lý transaction
    return dbTransaction.withTransaction(async (session) => {
      const newPost = await postModel.create(
        [
          {
            content,
            images,
            status,
            createdBy: userId,
            updatedBy: userId
          }
        ],
        { session } // truyền session vào để MongoDB quản lý transaction
      )

      return newPost[0].populate('createdBy', 'fullName')
    })
  },
  update: async () => {},
  delete: async () => {}
}

export default PostService
