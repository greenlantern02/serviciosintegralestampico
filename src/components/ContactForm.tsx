"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ContactForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const nombre = data.get("nombre");
    const empresa = data.get("empresa");
    const mensaje = data.get("mensaje");
    const subject = encodeURIComponent(`Solicitud de información - ${empresa || nombre}`);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmpresa: ${empresa}\n\nMensaje:\n${mensaje}`
    );
    window.location.href = `mailto:serviciosintegralesdetampico@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
        <input
          id="nombre" name="nombre" type="text" required placeholder="Su nombre completo"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
        />
      </div>
      <div>
        <label htmlFor="empresa" className="block text-sm font-semibold text-gray-700 mb-1">Empresa</label>
        <input
          id="empresa" name="empresa" type="text" placeholder="Nombre de su empresa"
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors"
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-1">¿Qué productos necesita?</label>
        <textarea
          id="mensaje" name="mensaje" rows={4} required
          placeholder="Describa los productos o servicios que requiere..."
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal transition-colors resize-none"
        />
      </div>
      <button type="submit" className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}>
        Enviar solicitud <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-gray-400 text-center">Le responderemos a la brevedad posible.</p>
    </form>
  );
}
