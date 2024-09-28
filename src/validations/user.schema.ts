import z from 'zod'
import { FormRegisterSchema } from './auth.schema'

export const FormChangePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' }),
    newPassword: z
      .string()
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
    confirmPassword: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' })
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirm password must match new password.',
    path: ['confirmPassword']
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password.',
    path: ['newPassword']
  })

export type ChangePasswordType = z.infer<typeof FormChangePasswordSchema>

export const FormCreateUserSchema = FormRegisterSchema.extend({
  roles: z.array(z.string()).min(1, { message: 'Roles can not be blank' }),
  phoneNumber: z
    .string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
      message: 'Phone number is invalid (Viet Nam phone number only).'
    })
    .optional()
})
  .strict()
  .strip()

export type CreateUserType = z.infer<typeof FormCreateUserSchema>

export const FormUpdateUserSchema = z
  .object({
    fullName: z
      .string({ message: 'Fullname can not be blank' })
      .min(3, { message: 'Name must be at least 3 characters.' })
      .max(20, { message: 'Name must not exceed 20 characters.' }),
    phoneNumber: z.string().regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, {
      message: 'Phone number is invalid (Viet Nam phone number only).'
    })
  })
  .strict()
  .strip()

export type UpdateUserType = z.infer<typeof FormUpdateUserSchema>

export const ParamsUserSchema = z
  .object({
    userId: z.string({ message: 'UserId can not be blank' })
  })
  .strict()

export type ParamsUserType = z.infer<typeof ParamsUserSchema>
