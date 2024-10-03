import postModel from '@/models/post.model'
import { ObjectId } from 'mongoose'
import {
  EPagination,
  ESortDirection,
  ESortPostField,
  EStatus
} from '@/constants/enums'
import { PostPaginationType } from '@/validations/post.schema'

interface IPostService {
  findAll: ({
    page,
    limit,
    sortField,
    sortDirection,
    status
  }: PostPaginationType) => Promise<any>
  findById: (_id: ObjectId) => Promise<any>
  create: () => Promise<any>
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
      select: '-updatedBy',
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
  create: async () => {},
  update: async () => {},
  delete: async () => {}
}

export default PostService
