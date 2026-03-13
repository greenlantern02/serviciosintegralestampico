import Link from "next/link";
import { SiLogo } from "@/components/brand/SiLogo";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white py-12">
      <div className="container-brand">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <SiLogo size={36} />
            <div>
              <div className="font-black text-brand-teal">Servicios Integrales</div>
              <div className="text-xs text-white/40 mt-0.5">Ciudad Madero, Tamaulipas · Cobertura Nacional</div>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/60">
            <Link href="/" className="hover:text-brand-teal transition-colors">Inicio</Link>
            <Link href="/#nosotros" className="hover:text-brand-teal transition-colors">Nosotros</Link>
            <Link href="/productos" className="hover:text-brand-teal transition-colors">Productos</Link>
            <Link href="/#contacto" className="hover:text-brand-teal transition-colors">Contacto</Link>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <a href="tel:+528331112410" className="flex items-center gap-2 hover:text-brand-teal transition-colors">
              <Phone className="w-4 h-4" /> +52 833 111 2410
            </a>
            <a href="mailto:serviciosintegralesdetampico@gmail.com" className="flex items-center gap-2 hover:text-brand-teal transition-colors">
              <Mail className="w-4 h-4" /> serviciosintegralesdetampico@gmail.com
            </a>
            <a href="https://bit.ly/servicios_integrales" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-teal transition-colors">
              <Globe className="w-4 h-4" /> Catálogo digital
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Ciudad Madero, Tamaulipas
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs text-white/30">
          <p>© 2026 Servicios Integrales. Todos los derechos reservados.</p>
          <p>Calidad · Precios Justos · Servicio Único</p>
        </div>
      </div>
    </footer>
  );
}
