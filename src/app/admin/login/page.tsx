"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/admin/auth";
import type { ActionResult } from "@/types/actions";

const initialState: ActionResult<null> = { success: true, data: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-white font-black text-2xl tracking-tight">SI Admin</span>
          <p className="text-white/40 text-sm mt-1">Servicios Integrales de Tampico</p>
        </div>

        <form action={formAction} className="space-y-4">
          {!state.success && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {state.error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-white/70 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
              placeholder="admin@empresa.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-white/70 text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-brand-teal text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-brand-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {pending ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
