import {z} from 'zod';

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

export const RegisterFormSchema = z.object({
    email: z.string().nonempty({
        message: 'Email is required',
    }).email({
        message: 'Invalid email address',
    }),
    name: z.string().nonempty({
        message: 'Name is required',
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