import { comparePassword, hashPassword } from '@/utils/crypto'
import { InferSchemaType, model, Schema } from 'mongoose'

const DOCUMENT_NAME = 'user'
const COLLECTION_NAME = 'users'

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      default: null
    },
    password: {
      type: String,
      required: true
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'role'
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false
  }
)

export type TUser = InferSchemaType<typeof UserSchema> & {
  comparePassword: (password: string) => Promise<boolean>
}

UserSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  user.password = await hashPassword(user.password)
  return next()
})

UserSchema.methods.comparePassword = async function (password: string) {
  const user = this as TUser
  return await comparePassword(password, user.password)
}

export default model<TUser>(DOCUMENT_NAME, UserSchema)
