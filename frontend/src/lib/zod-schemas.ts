import { z } from "zod";

export const formSchema = z.object({
    blockType: z.enum(["cold-email", "wait-delay"]),
    emailTemplate: z.string().optional(),
    delayDuration: z.string().optional(),
    delayUnit: z.enum(["minutes", "hours", "days"]).optional(),
})

export type FormSchemaType = z.infer<typeof formSchema>;

export const sourceFormSchema = z.object({
    sourceType: z.enum(["list"]),
    listName: z.string().min(1, "Please select a list"),
})

export type SourceFormValues = z.infer<typeof sourceFormSchema>