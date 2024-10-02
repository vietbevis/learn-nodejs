import { update } from 'lodash'
import { InferSchemaType, model, Schema } from 'mongoose'

const DOCUMENT_NAME = 'token'
const COLLECTION_NAME = 'tokens'

const TokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      update: false,
      ref: 'user'
    },
    publicKey: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false
  }
)

export type TToken = InferSchemaType<typeof TokenSchema>

export default model<TToken>(DOCUMENT_NAME, TokenSchema)
