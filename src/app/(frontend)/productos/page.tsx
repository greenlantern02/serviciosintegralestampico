import type { Metadata } from "next";
import { Suspense } from "react";
import { getProductosByCategoria } from "@/actions/productos";
import { getCategorias } from "@/actions/categorias";
import { ProductCard } from "@/components/catalog/ProductCard";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { GeoTR } from "@/components/brand/GeoTriangles";
import type { Producto } from "@/types/cms";

export const metadata: Metadata = {
  title: "Catálogo de Productos",
  description:
    "Amplia gama de productos de higiene y seguridad industrial. EPP, calzado, jarciería, bolsas y más.",
};

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

async function ProductsList({ categoria }: { categoria?: string }) {
  const docs: Producto[] = await getProductosByCategoria(categoria);

  if (docs.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-gray-400 text-lg">No hay productos en esta categoría.</p>
      </div>
    );
  }

  return (
    <>
      {docs.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

export default async function ProductosPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const cats = await getCategorias();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-brand-light-blue pt-28 pb-16 overflow-hidden">
        <GeoTR />
        <div className="container-brand">
          <p className="section-eyebrow">Catálogo 2026</p>
          <h1 className="section-title">
            Nuestros <span className="text-brand-teal">Productos</span>
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Amplia gama de productos en un solo proveedor. Todo lo que su empresa necesita
            para operar con seguridad y eficiencia.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-brand space-y-8">
          <Suspense>
            <CategoryFilter categorias={cats} activa={categoria} />
          </Suspense>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Suspense
              fallback={
                <div className="col-span-full text-center py-20 text-gray-400">
                  Cargando productos...
                </div>
              }
            >
              <ProductsList categoria={categoria} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
