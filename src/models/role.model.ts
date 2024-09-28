import { ERole } from '@/constants/enums'
import { InferSchemaType, model, Schema } from 'mongoose'

const DOCUMENT_NAME = 'role'
const COLLECTION_NAME = 'roles'

const RoleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ERole,
      unique: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false
  }
)

export type TRole = InferSchemaType<typeof RoleSchema>

export default model<TRole>(DOCUMENT_NAME, RoleSchema)
