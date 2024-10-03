import { EPagination } from '@/constants/enums'
import { NotFoundError } from '@/core/error.response'
import { Schema, Document, Query, Model } from 'mongoose'

// Định nghĩa interface cho paginate kết quả
interface PaginateResult<T> {
  records: T[]
  paginate: {
    totalRecords: number
    limit: number
    totalPages: number
    currentPage: number
    hasPrevPage: boolean
    hasNextPage: boolean
    prevPage: number | null
    nextPage: number | null
  }
}

// Định nghĩa type cho các tùy chọn phân trang
interface PaginateOptions {
  page?: number
  limit?: number
  sort?: any
  select?: any
  populate?: any
}

// Định nghĩa một interface cho các method phân trang
interface PaginateModel<T extends Document> extends Model<T> {
  paginate(query?: any, options?: PaginateOptions): Promise<PaginateResult<T>>
}

// Tạo plugin phân trang
const paginatePlugin = function <T extends Document>(schema: Schema<T>): void {
  schema.statics.paginate = async function (
    query: any = {},
    options: PaginateOptions = {}
  ): Promise<PaginateResult<T>> {
    const currentPage = options.page ?? EPagination.PAGE
    const limit = options.limit ?? EPagination.LIMIT
    const skip = (currentPage - 1) * limit

    const [records, totalRecords] = await Promise.all([
      this.find(query)
        .limit(limit)
        .skip(skip)
        .sort(options.sort)
        .select(options.select)
        .populate(options.populate)
        .exec(),
      this.countDocuments(query).exec()
    ])

    const totalPages = Math.ceil(totalRecords / limit)

    return {
      records,
      paginate: {
        totalRecords,
        limit,
        totalPages,
        currentPage,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
        nextPage: currentPage < totalPages ? currentPage + 1 : null
      }
    }
  }
}

// Xuất plugin
export { paginatePlugin, PaginateResult, PaginateOptions, PaginateModel }
