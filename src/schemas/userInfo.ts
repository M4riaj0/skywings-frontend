// schemas/personalInfoSchema.ts
import z from "zod";

export const userSchema = z.object({
  username: z.string().min(1, { message: "Se requiere un nombre de usuario" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "Por favor, confirma tu contraseña" }),
  email: z.string().email({ message: "Dirección de correo electrónico no válida" }),
  name1: z.string().optional(),
  name2: z.string().optional(),
  surname1: z.string().optional(),
  surname2: z.string().optional(),
  dni: z.string().min(1, { message: "El DNI debe tener al menos un carácter" }).optional(),
  address: z.string().min(1, { message: "La dirección debe tener al menos un carácter" }).optional(),
  birthplace: z.string().min(1, { message: "El lugar de nacimiento debe tener al menos un carácter" }).optional(),
  gender: z.enum(["male", "female", "other"], { message: "Selecciona un género" }).optional(),
  user_image: z.string().url({ message: "La imagen de usuario debe ser una URL válida" }).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas deben coincidir",
  path: ["confirmPassword"],
});
