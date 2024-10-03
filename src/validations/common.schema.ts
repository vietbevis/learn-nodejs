import z from 'zod'

const PaginationSchema = z
  .object({
    page: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Page must be a positive number'
      })
      .transform((val) => Number(val)),
    limit: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Limit must be a positive number'
      })
      .transform((val) => Number(val)),
    sortField: z.string().default('createdAt'),
    sortDirection: z.enum(['asc', 'desc']).default('desc')
  })
  .strict()
  .strip()

export type PaginationType = z.infer<typeof PaginationSchema>
export default PaginationSchema
