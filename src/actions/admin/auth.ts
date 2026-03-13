"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { createSession, deleteSession, getSession } from "@/lib/session";
import { usuarios } from "@/db/schema";
import type { ActionResult } from "@/types/actions";
import type { SessionPayload } from "@/types/admin";

export async function loginAction(
  _prev: ActionResult<null>,
  formData: FormData
): Promise<ActionResult<null>> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { success: false, error: "Email y contraseña son requeridos." };
  }

  const db = getDb();
  const rows = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
  const user = rows[0];

  if (!user) {
    return { success: false, error: "Credenciales incorrectas." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, error: "Credenciales incorrectas." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  return getSession();
}
