import { EStatus } from '@/constants/enums'
import { InferSchemaType, model, Schema, Document } from 'mongoose'
import { PaginateModel, paginatePlugin } from './plugins/paginate'

const DOCUMENT_NAME = 'post'
const COLLECTION_NAME = 'posts'

const PostSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: EStatus,
      default: EStatus.PUBLIC
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    images: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false
  }
)

PostSchema.plugin(paginatePlugin)

export type TPost = InferSchemaType<typeof PostSchema> & Document

export default model<TPost, PaginateModel<TPost>>(DOCUMENT_NAME, PostSchema)
