import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedProducts } from "@/actions/productos";
import { ProductCard } from "@/components/catalog/ProductCard";
import Image from "next/image";
import { GeoTR, GeoBL } from "@/components/brand/GeoTriangles";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone, Mail, Globe, MapPin,
  ChevronRight, ArrowRight,
  Shield, Star, Truck, Users,
  HardHat, ChefHat, Sparkles, Package, ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import type { Producto } from "@/types/cms";

export const metadata: Metadata = {
  title: "Servicios Integrales | Higiene y Seguridad Industrial",
  description:
    "Su aliado confiable en el suministro de productos de higiene y seguridad industrial. Calidad, precios justos y servicio único. Ciudad Madero, Tamaulipas.",
};

export const revalidate = 300;

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen bg-brand-light-blue flex items-center overflow-hidden pt-[72px]">
      <GeoTR />
      <GeoBL />
      <div className="container-brand py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Cobertura Nacional · Ciudad Madero, Tamaulipas</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-brand-navy leading-tight tracking-tight mb-5">
              Su aliado en{" "}
              <span className="text-brand-teal">higiene y<br />seguridad</span>{" "}
              industrial
            </h1>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed mb-7">
              Fundamos nuestra empresa sobre tres principios:{" "}
              <strong>calidad, precios justos y servicio único.</strong> Soluciones
              rápidas y adaptadas a sus requerimientos.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/productos" className={cn(buttonVariants({ size: "lg" }))}>
                Ver Catálogo <ChevronRight className="w-5 h-5" />
              </Link>
              <a href="#contacto" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Solicitar Cotización
              </a>
            </div>
            <div className="flex flex-wrap gap-8 pt-6 border-t border-brand-light-blue-2">
              {[
                { value: "6+", label: "Categorías de producto" },
                { value: "B2B", label: "Enfoque empresarial" },
                { value: "100%", label: "Compromiso de calidad" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-brand-teal">{s.value}</div>
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card visual */}
          <div className="relative hidden md:block pl-8 pb-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              <GeoTR className="opacity-50" />
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="Servicios Integrales logo" width={44} height={44} className="object-contain" />
                <div>
                  <div className="font-black text-brand-teal text-base">Servicios Integrales</div>
                  <div className="text-xs text-gray-400">Perfil Corporativo</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { Icon: Shield, label: "Equipo de Protección Personal" },
                  { Icon: HardHat, label: "Cascos y Seguridad Industrial" },
                  { Icon: ChefHat, label: "Restaurantes y Cocina" },
                  { Icon: Sparkles, label: "Jarciería y Limpieza" },
                  { Icon: Package, label: "Bolsas de Polietileno" },
                  { Icon: ShoppingBag, label: "Artículos en General" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-light-blue flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-brand-teal" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
                    <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-brand-teal" /> +52 833 111 2410
              </div>
            </div>
            <div className="absolute bottom-0 left-0 bg-brand-navy text-white rounded-xl px-4 py-3 shadow-xl">
              <div className="text-xs opacity-60 uppercase tracking-wider font-semibold">Cobertura</div>
              <div className="font-black text-lg">Nacional</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="nosotros" className="relative py-24 bg-white overflow-hidden">
      <GeoTR className="opacity-60" />
      <div className="container-brand">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="section-eyebrow">¿Quiénes somos?</p>
            <h2 className="section-title">Su proveedor <span className="text-brand-teal">confiable</span></h2>
            <p className="mt-5 text-gray-600 text-lg leading-relaxed">
              Somos su aliado confiable en el suministro de productos de{" "}
              <strong>higiene y seguridad industrial</strong> y cualquier otro insumo
              que su negocio necesite.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Ofrecemos soluciones rápidas, de calidad y adaptadas a sus requerimientos,
              para que usted pueda enfocarse en lo más importante: hacer crecer su empresa.
            </p>
            <a href="#contacto" className={cn(buttonVariants({ size: "lg" }), "mt-7 inline-flex")}>
              Contáctenos hoy <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-5">
            {[
              {
                accent: "teal",
                icon: Star,
                label: "NUESTRA MISIÓN",
                text: "Proporcionar a las empresas productos de higiene y seguridad industrial y todo tipo de insumos con rapidez, calidad y atención personalizada. Ofreciendo soluciones confiables y adaptadas a las necesidades de cada cliente.",
              },
              {
                accent: "navy",
                icon: Globe,
                label: "NUESTRA VISIÓN",
                text: "Convertirnos en el líder a nivel nacional en la distribución y comercialización de insumos de higiene y seguridad industrial. Buscamos ser reconocidos como la mejor opción en calidad y precio, estableciendo relaciones duraderas y de confianza.",
              },
            ].map(({ accent, icon: Icon, label, text }) => (
              <Card
                key={label}
                className={cn(
                  "border-l-4",
                  accent === "teal" ? "border-l-brand-teal" : "border-l-brand-navy"
                )}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", accent === "teal" ? "bg-brand-teal" : "bg-brand-navy")}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black text-brand-navy uppercase tracking-widest">{label}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Values ──────────────────────────────────────────────────────────────────
const VALUES = [
  { num: "01", title: "Confianza", desc: "Generando un clima de cercanía a través de una comunicación clara, personalizada y transparente." },
  { num: "02", title: "Empatía", desc: "Entendiendo y conociendo a nuestros clientes. Sintiéndonos parte de una alianza común en torno a un objetivo compartido." },
  { num: "03", title: "Excelencia", desc: "Cumpliendo lo prometido, superando expectativas y cuidando cada detalle para asegurar un servicio eficiente y soluciones efectivas." },
  { num: "04", title: "Integridad", desc: "Privilegiando los intereses y la confidencialidad de la información de nuestros clientes, cuidando a nuestro personal." },
];

function Values() {
  return (
    <section id="valores" className="relative py-24 bg-brand-light-blue overflow-hidden">
      <GeoBL />
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Lo que nos define</p>
          <h2 className="section-title">Nuestros <span className="text-brand-teal">Valores</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <Card key={v.num} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="w-11 h-11 bg-brand-navy text-white rounded-lg flex items-center justify-center font-black text-base mb-4 group-hover:bg-brand-teal transition-colors">
                  {v.num}
                </div>
                <h3 className="font-black text-brand-navy text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Products (from CMS) ────────────────────────────────────────────
async function FeaturedProducts() {
  let docs: Producto[] = [];
  try {
    docs = await getFeaturedProducts();
  } catch {
    return null;
  }

  if (docs.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container-brand">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="section-eyebrow">Catálogo 2026</p>
            <h2 className="section-title">Productos <span className="text-brand-teal">Destacados</span></h2>
          </div>
          <Link href="/productos" className={cn(buttonVariants({ variant: "outline" }))}>
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Advantages ──────────────────────────────────────────────────────────────
function Advantages() {
  const items = [
    { Icon: ShoppingBag, title: "Amplia gama en un solo proveedor", desc: "EPP, calzado, cocina, limpieza y más, sin necesidad de múltiples proveedores." },
    { Icon: Star, title: "Precios competitivos", desc: "Precios justos sin comprometer la calidad. Nuestra promesa desde el día uno." },
    { Icon: Truck, title: "Respuesta rápida", desc: "Su operación no puede esperar. Actuamos con rapidez y cumplimos los tiempos." },
    { Icon: Users, title: "Asesoría personalizada", desc: "Le ayudamos a identificar los productos correctos para su operación específica." },
  ];
  return (
    <section className="relative py-24 bg-brand-navy overflow-hidden">
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="text-brand-teal font-bold text-xs uppercase tracking-widest mb-2">¿Por qué elegirnos?</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Ventajas <span className="text-brand-teal">Competitivas</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map(({ Icon, title, desc }) => (
            <div key={title} className="text-center group">
              <div className="w-16 h-16 bg-brand-teal/10 border border-brand-teal/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-teal transition-colors duration-300">
                <Icon className="w-7 h-7 text-brand-teal group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Clients ─────────────────────────────────────────────────────────────────
function Clients() {
  const sectors = [
    "Industrias manufactureras", "Empresas constructoras", "Hospitales y clínicas",
    "Restaurantes y alimentos", "Instituciones educativas", "Comercios y retail",
    "Empresas de servicios", "Grandes corporativos",
  ];
  return (
    <section id="clientes" className="relative py-24 bg-brand-light-blue overflow-hidden">
      <GeoTR className="opacity-60" />
      <div className="container-brand">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-eyebrow">A quiénes servimos</p>
            <h2 className="section-title">Nuestros <span className="text-brand-teal">Clientes</span></h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Atendemos empresas de diversos sectores que buscan un proveedor confiable
              para el suministro de productos de higiene, seguridad industrial y cualquier
              otro insumo que requieran para su operación.
            </p>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Desde pequeñas y medianas empresas hasta grandes corporativos, todos confían
              en nosotros por nuestra capacidad de ofrecer{" "}
              <strong>soluciones rápidas, de calidad y adaptadas</strong> a sus necesidades.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {sectors.map((s) => (
              <div key={s} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-brand-teal flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contacto" className="relative py-24 bg-white overflow-hidden">
      <GeoBL className="opacity-60" />
      <div className="container-brand">
        <div className="text-center mb-14">
          <p className="section-eyebrow">Estamos listos para ayudarle</p>
          <h2 className="section-title">Contáctenos</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Descubra lo que podemos hacer por su empresa.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto items-start">
          {/* Info */}
          <div className="space-y-5">
            {[
              { Icon: Phone, label: "Teléfono", value: "+52 833 111 2410", href: "tel:+528331112410" },
              { Icon: Mail, label: "Correo electrónico", value: "serviciosintegralesdetampico@gmail.com", href: "mailto:serviciosintegralesdetampico@gmail.com" },
              { Icon: Globe, label: "Catálogo digital", value: "bit.ly/servicios_integrales", href: "https://bit.ly/servicios_integrales" },
              { Icon: MapPin, label: "Ubicación", value: "Ciudad Madero, Tamaulipas", href: null },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-light-blue rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-teal" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</div>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-semibold text-brand-navy hover:text-brand-teal transition-colors break-all text-sm">
                      {value}
                    </a>
                  ) : (
                    <span className="font-semibold text-brand-navy text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}
            <a href="tel:+528331112410" className={cn(buttonVariants({ size: "lg" }), "mt-4 inline-flex")}>
              <Phone className="w-5 h-5" /> Llamar ahora
            </a>
          </div>

          {/* Form */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-black text-brand-navy text-lg mb-5">Solicitar información</h3>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ─── Contact form (client island) ────────────────────────────────────────────
import { ContactForm } from "@/components/ContactForm";

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Values />
      <FeaturedProducts />
      <Advantages />
      <Clients />
      <Contact />
    </>
  );
}
