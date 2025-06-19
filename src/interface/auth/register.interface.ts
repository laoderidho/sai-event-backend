import {z} from 'zod'

export const Vregister = z.object({
    name: z.string()
        .min(3, 'Nama minimal 3 karakter')
        .max(50, 'Nama maksimal 50 karakter'),

    email: z.string()
        .email('Email tidak valid')
        .max(100, 'Email maksimal 100 karakter'),

    password: z.string()
        .min(6, 'Password minimal 6 karakter')
        .max(100, 'Password maksimal 100 karakter'),

    no_telp: z.string()
        .min(10, 'Nomor telepon minimal 10 digit')
        .max(15, 'Nomor telepon maksimal 15 digit')
        .regex(/^\d+$/, 'Nomor telepon harus berupa angka'),

    congregation_id: z.number()
        .min(0, 'Congregation ID harus lebih dari 0'),
})

export type IRegister = z.infer<typeof Vregister>;
