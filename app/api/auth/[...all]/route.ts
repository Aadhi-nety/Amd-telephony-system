// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextHandler } from "better-auth/next";

const handler = toNextHandler(auth);

export const { GET, POST } = handler;