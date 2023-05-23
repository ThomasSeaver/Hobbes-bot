import z from "zod";
import "dotenv/config";

const environmentSchema = z.object({
  CLIENT_ID: z.string(),
  TOKEN: z.string(),
});

export const { CLIENT_ID, TOKEN } = environmentSchema.parse(process.env);
