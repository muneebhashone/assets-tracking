import * as z from "zod";

export const profileSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "Product Name must be at least 3 characters" }),
  lastname: z
    .string()
    .min(3, { message: "Product Name must be at least 3 characters" }),
  email: z
    .string()
    .email({ message: "Product Name must be at least 3 characters" }),
  contactno: z.coerce.number(),
  country: z.string().min(1, { message: "Please select a category" }),
  city: z.string().min(1, { message: "Please select a category" }),
  // jobs array is for the dynamic fields
  jobs: z.array(
    z.object({
      jobcountry: z.string().min(1, { message: "Please select a category" }),
      jobcity: z.string().min(1, { message: "Please select a category" }),
      jobtitle: z
        .string()
        .min(3, { message: "Product Name must be at least 3 characters" }),
      employer: z
        .string()
        .min(3, { message: "Product Name must be at least 3 characters" }),
      startdate: z
        .string()
        .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
          message: "Start date should be in the format YYYY-MM-DD",
        }),
      enddate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "End date should be in the format YYYY-MM-DD",
      }),
    }),
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const createUserFormSchema = z.object({
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "Enter a valid email address" }),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "atleast 8 charaacters long" })
    .max(32, { message: "atmost is 32 characters" }),
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
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "atleast 8 characters long" })
    .max(64, { message: "atmost is 12 characters" }),
  name: z.string({ required_error: "name is required" }).min(3),
});
