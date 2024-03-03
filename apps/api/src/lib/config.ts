import { ZodError, z } from "zod";

const configSchema = z.object({
  publicUrl: z.string().default("http://localhost:3000"),
  http: z.object({
    port: z.coerce.number().default(3000),
    cors: z
      .string()
      .transform((val) => JSON.parse(val))
      .pipe(z.array(z.string()).default(["http://localhost"])),
  }),

  db: z.object({
    type: z.string().default("mongodb"),
    host: z.string().nullable().optional().default("localhost"),
    synchronize: z.coerce.boolean().default(true),
  }),

  secrets: z.object({
    jwt: z.string(),
  }),

  aws: z.object({
    s3Region: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
    bucketName: z.string(),
  }),
});

export const config = () => {
  try {
    return configSchema.parse({
      publicUrl: process.env.API_PUBLIC_URL,

      http: {
        port: process.env.API_HTTP_PORT,
        cors: process.env.API_HTTP_CORS,
      },

      db: {
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        synchronize: process.env.DATABASE_ENABLE_SYNC,
      },

      secrets: {
        jwt: process.env.API_SECRETS_JWT,
      },

      aws: {
        s3Region: process.env.AWS_S3_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: process.env.AWS_BUCKET_NAME,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      const path = first.path.join(".");
      throw new Error(`${path} - ${first.message}`);
    }

    throw err;
  }
};
