import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name:      z.string().min(2, 'Nome muito curto'),
    email:     z.string().email('E-mail inválido'),
    password:  z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    phone:     z.string().optional(),
    dateBirth: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(1, "Senha obrigatória"),
  }),
});
