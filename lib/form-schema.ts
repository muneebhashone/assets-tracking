import { passwordValidation } from "@/utils/auth.utils";
import { z, infer as zInfer } from "zod";

export const createUserFormSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Enter a valid email address" }),
  password: passwordValidation("password"),
  name: z.string({ required_error: "name is required" }).min(3),
  companyId: z
    .string({ required_error: "Company Id is required" })
    .transform(Number),
});

export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>;

export const createCompanySchema = z.object({
  companyName: z.string({ required_error: "Company name is required" }).min(3),
  country: z.string({ required_error: "Country is required" }),
  city: z.string({ required_error: "City is required" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Enter a valid email address" }),
  password: passwordValidation("password"),
  name: z.string({ required_error: "name is required" }).min(3),
});

export const createAdminCompanySchema = z
  .object({
    companyName: z
      .string({ required_error: "Company name is required" })
      .min(3),
    country: z.string({ required_error: "Country is required" }),
    city: z.string({ required_error: "City is required" }),
    email: z
      .string({ required_error: "email is required" })
      .email({ message: "Enter a valid email address" }),
    password: passwordValidation("password"),
    name: z.string({ required_error: "name is required" }).min(3),
    type: z.enum(["CLIENT", "WHITE_LABEL"]),
    parentCompany: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "CLIENT" && !data.parentCompany) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent company is required",
        path: ["parentCompany"],
      });
    }
  });

export type CreateUserSchemaType = zInfer<typeof createUserFormSchema>;

export type CreateCompanySchemaType = zInfer<typeof createCompanySchema>;
