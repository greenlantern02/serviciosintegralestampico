import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductoBySlug, getProductoStaticPaths } from "@/actions/productos";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/brand/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { GeoTR } from "@/components/brand/GeoTriangles";
import { ChevronLeft, Star, CheckCircle2 } from "lucide-react";
import type { Producto } from "@/types/cms";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    return await getProductoStaticPaths();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductoBySlug(slug);
  if (!product) return {};
  return {
    title: product.nombre,
    description: product.descripcionCorta ?? undefined,
  };
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;
  const product: Producto | null = await getProductoBySlug(slug);

  if (!product || product.estado !== "publicado") notFound();

  const waUrl = buildWhatsAppUrl(product.nombre);

  const colorVariantMap: Record<string, "default" | "navy" | "orange" | "coral"> = {
    teal: "default", navy: "navy", orange: "orange", coral: "coral",
  };
  const badgeVariant = colorVariantMap[product.categoria?.color ?? "teal"] ?? "default";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-light-blue pt-24 pb-6">
        <div className="container-brand">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1 text-sm text-brand-teal font-medium hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al catálogo
          </Link>
        </div>
      </div>

      <section className="relative pb-20 overflow-hidden">
        <GeoTR className="opacity-50" />
        <div className="container-brand pt-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-brand-light-blue rounded-2xl overflow-hidden">
                {product.imagenes[0]?.media.url ? (
                  <Image
                    src={product.imagenes[0].media.url}
                    alt={product.imagenes[0].media.alt || product.nombre}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl text-brand-teal/20 font-black uppercase">
                      {product.nombre.slice(0, 2)}
                    </span>
                  </div>
                )}
                {product.destacado && (
                  <div className="absolute top-4 left-4 bg-brand-yellow text-brand-navy text-sm font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    Destacado
                  </div>
                )}
              </div>

              {product.imagenes.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.imagenes.map((img, i) => (
                    <div
                      key={img.id}
                      className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-brand-light-blue border-2 border-brand-teal/20"
                    >
                      <Image
                        src={img.media.url}
                        alt={img.media.alt || `Imagen ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {product.categoria && (
                <Badge variant={badgeVariant}>{product.categoria.nombre}</Badge>
              )}

              <h1 className="text-3xl sm:text-4xl font-black text-brand-navy leading-tight">
                {product.nombre}
              </h1>

              {product.descripcionCorta && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.descripcionCorta}
                </p>
              )}

              <div className="pt-2">
                <WhatsAppButton url={waUrl} size="xl" className="w-full sm:w-auto" />
                <p className="text-xs text-gray-400 mt-2">
                  Le responderemos a la brevedad con precio y disponibilidad.
                </p>
              </div>

              {product.especificaciones.length > 0 && (
                <div>
                  <h2 className="font-black text-brand-navy text-lg mb-3 uppercase tracking-wide text-sm">
                    Especificaciones técnicas
                  </h2>
                  <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                    {product.especificaciones.map((spec, i) => (
                      <div key={i} className="flex">
                        <div className="w-2/5 bg-brand-light-blue px-4 py-3 text-sm font-semibold text-brand-navy">
                          {spec.clave}
                        </div>
                        <div className="flex-1 px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                          {spec.valor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {product.descripcion && (
            <div className="mt-16 max-w-3xl">
              <h2 className="section-title mb-6">
                Descripción <span className="text-brand-teal">completa</span>
              </h2>
              <div className="prose prose-gray max-w-none">
                <RichTextRenderer content={product.descripcion} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

type LexicalNode = {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  listType?: string;
};

function RichTextRenderer({ content }: { content: string }) {
  let parsed: { root?: { children?: LexicalNode[] } };
  try {
    parsed = JSON.parse(content);
  } catch {
    return <p className="text-gray-600">{content}</p>;
  }

  const root = parsed.root;
  if (!root?.children) return null;

  return <>{root.children.map((node, i) => renderNode(node, i))}</>;
}

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="text-gray-600 leading-relaxed mb-4">
          {node.children?.map((c, i) => renderNode(c, i))}
        </p>
      );
    case "heading":
      return (
        <h3 key={key} className="font-bold text-brand-navy text-xl mt-6 mb-2">
          {node.children?.map((c, i) => renderNode(c, i))}
        </h3>
      );
    case "list":
      return node.listType === "bullet" ? (
        <ul key={key} className="list-disc list-inside text-gray-600 space-y-1 mb-4">
          {node.children?.map((c, i) => renderNode(c, i))}
        </ul>
      ) : (
        <ol key={key} className="list-decimal list-inside text-gray-600 space-y-1 mb-4">
          {node.children?.map((c, i) => renderNode(c, i))}
        </ol>
      );
    case "listitem":
      return <li key={key}>{node.children?.map((c, i) => renderNode(c, i))}</li>;
    case "text": {
      let text: React.ReactNode = node.text;
      if (node.format && node.format & 1) text = <strong>{text}</strong>;
      if (node.format && node.format & 2) text = <em>{text}</em>;
      return <span key={key}>{text}</span>;
    }
    default:
      return null;
  }
}
