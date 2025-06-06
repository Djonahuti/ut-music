import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authFormSchema = (type: string) => z.object({
  // sign up
  fullName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  // both
  email: z.string().email(),
  password: z.string().min(6),
})