import { BadRequestError } from '@/core/error.response'
import roleModel from '@/models/role.model'
import mongoose from 'mongoose'

interface IRoleService {
  exists: (roles: string[]) => Promise<mongoose.Types.ObjectId[]>
  create: (name: string) => Promise<any>
}

const RoleService: IRoleService = {
  exists: async (roles = []) => {
    return await roleModel
      .find({ name: { $in: roles } })
      .lean()
      .distinct('_id')
      .exec()
  },
  create: async (name = '') => {
    if (!name) throw new BadRequestError('Role name is required')

    if (await roleModel.exists({ name }))
      throw new BadRequestError('Role already exists')

    return await roleModel.create({ name })
  }
}

export default RoleService
