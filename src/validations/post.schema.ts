import z from 'zod'
import PaginationSchema from './common.schema'
import { ESortPostField, EStatus } from '@/constants/enums'

const PostPaginationSchema = PaginationSchema.extend({
  sortField: z
    .nativeEnum(ESortPostField, {
      message: 'Invalid field. (createdAt, updatedAt)'
    })
    .default(ESortPostField.CREATED_AT),
  status: z.nativeEnum(EStatus).default(EStatus.PUBLIC)
})

export type PostPaginationType = z.infer<typeof PostPaginationSchema>

export default PostPaginationSchema
