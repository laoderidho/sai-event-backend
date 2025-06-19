import { Context } from "hono";
import { z } from "zod";
import { zodError } from "../ExceptionError/zodError";
import { HTTPException } from "hono/http-exception"; // <-- penting!

export const HandleError = (error: unknown, c: Context) => {
  if (error instanceof z.ZodError) {
    return c.json(zodError(error), 400);
  }

  if (error instanceof HTTPException) {
    return c.json(
      {
        status: "error",
        message: error.message || "HTTP Error",
      },
      error.status
    );
  }

  if (error instanceof Error) {
    return c.json({ message: error.message }, 400);
  }

  return c.json({ message: "Unknown error occurred" }, 500);
};
