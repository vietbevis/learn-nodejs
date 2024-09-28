import { z } from 'zod'

export const FormRegisterSchema = z
  .object({
    fullName: z
      .string({ message: 'Fullname can not be blank' })
      .min(3, { message: 'Name must be at least 3 characters.' })
      .max(20, { message: 'Name must not exceed 20 characters.' }),
    email: z.string({ message: 'Email can not be blank' }).email({
      message: 'Invalid email address.'
    }),
    password: z
      .string({ message: 'Password can not be blank' })
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' })
      .regex(/(?=.*[A-Z])/, {
        message: 'At least one uppercase character.'
      })
      .regex(/(?=.*[a-z])/, {
        message: 'At least one lowercase character.'
      })
      .regex(/(?=.*\d)/, {
        message: 'At least one digit.'
      })
      .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: 'At least one special character.'
      }),
    roles: z
      .array(z.string())
      .min(1, { message: 'Role is required' })
      .optional()
  })
  .strict() // Bắt buộc phải có các field được định nghĩa trong schema
  .strip() // Loại bỏ các field không được định nghĩa trong schema
export type RegisterBodyType = z.infer<typeof FormRegisterSchema>

export const FormLoginSchema = z
  .object({
    email: z.string({ message: 'Email can not be blank' }).email({
      message: 'Invalid email address.'
    }),
    password: z
      .string({ message: 'Password can not be blank' })
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' })
      .regex(/(?=.*[A-Z])/, {
        message: 'At least one uppercase character.'
      })
      .regex(/(?=.*[a-z])/, {
        message: 'At least one lowercase character.'
      })
      .regex(/(?=.*\d)/, {
        message: 'At least one digit.'
      })
      .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: 'At least one special character.'
      })
  })
  .strict()
  .strip()
export type LoginBodyType = z.infer<typeof FormLoginSchema>

export const FormRefreshTokenSchema = z
  .object({
    refreshToken: z.string({ message: 'RefreshToken can not be blank' })
  })
  .strict()
  .strip()
export type RefreshTokenBodyType = z.infer<typeof FormRefreshTokenSchema>
