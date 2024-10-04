import z from 'zod'
import PaginationSchema from './common.schema'
import { ESortPostField, EStatus } from '@/constants/enums'

export const PostPaginationSchema = PaginationSchema.extend({
  sortField: z
    .nativeEnum(ESortPostField, {
      message: 'Invalid field. (createdAt, updatedAt)'
    })
    .default(ESortPostField.CREATED_AT),
  status: z.nativeEnum(EStatus).default(EStatus.PUBLIC)
})

export type PostPaginationType = z.infer<typeof PostPaginationSchema>

export const FormCreatePostSchema = z
  .object({
    content: z.string().min(1).max(2000),
    images: z.array(z.string()).max(10),
    status: z.nativeEnum(EStatus).default(EStatus.PUBLIC)
  })
  .strict()
  .strip()

export type FormCreatePostType = z.infer<typeof FormCreatePostSchema>
