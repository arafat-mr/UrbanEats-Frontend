import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env= createEnv({
    server:{
        BACK_END_API:z.url(),
        FRONT_END_API: z.url(),
        API_URL:z.url(),
        AUTH_URL:z.url()
    },
    runtimeEnv:{
         BACK_END_API:process.env.BACK_END_API,
        FRONT_END_API: process.env.FRONT_END_API,
        API_URL:process.env.API_URL,
        AUTH_URL:process.env.AUTH_URL
    }
})