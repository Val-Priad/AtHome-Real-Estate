"use server";

import { signIn, signOut } from "@/auth";

export async function doCredentialLogIn(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (typeof result === "string") {
      return { success: true, redirectUrl: result };
    }

    if (result && typeof result === "object" && result.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unexpected error" };
  }
}

export async function doLogOut() {
  await signOut({ redirectTo: "/" });
}
