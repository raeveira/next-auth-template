import {z} from 'zod';

/*
* Login form schema.
*
* This schema is used to validate the login form.
*
* @Returns z.ZodObject
* */
export const LoginFormSchema = z.object({
    email: z.string().nonempty({
        message: 'Email is required',
    }).email({
        message: 'Invalid email address',
    }),
    password: z.string().nonempty({
        message: 'Password is required',
    }),
});

/*
* Register form schema.
*
* This schema is used to validate the register form.
*
* @Returns z.ZodObject
* */
export const RegisterFormSchema = z.object({
    email: z.string().nonempty({
        message: 'Email is required',
    }).email({
        message: 'Invalid email address',
    }),
    name: z.string().nonempty({
        message: 'Name is required',
    }),
    username: z
        .string()
        .min(3, {
            message: 'Username must be at least 3 characters',
        })
        .max(30, {
            message: 'Username must be less than 30 characters',
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: 'Username can only contain letters, numbers, and underscores',
        }),
    password: z.string().nonempty({
        message: 'Password is required',
    }).min(8, {
        message: 'Password must be at least 8 characters',
    }).refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter',
    }).refine((password) => /[A-Z]/.test(password), {
        message: 'Password must contain at least one uppercase letter',
    }).refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one number',
    }).refine((password) => /[^a-zA-Z0-9]/.test(password), {
        message: 'Password must contain at least one special character',
    }),
    confirmPassword: z.string().nonempty({
        message: 'Confirm password is required',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
})

/*
 * Profile form schema.
 *
 * This schema is used to validate the profile edit form.
 *
 * @Returns z.ZodObject
 */
export const ProfileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Name must be at least 2 characters',
        })
        .max(50, {
            message: 'Name must be less than 50 characters',
        }),
    username: z
        .string()
        .min(3, {
            message: 'Username must be at least 3 characters',
        })
        .max(30, {
            message: 'Username must be less than 30 characters',
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message: 'Username can only contain letters, numbers, and underscores',
        }),
    bio: z
        .string()
        .max(160, {
            message: 'Bio must be less than 160 characters',
        })
        .optional()
        .or(z.literal('')),
    image: z.instanceof(File).optional().or(z.literal("")),
})

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>
