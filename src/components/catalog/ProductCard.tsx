import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, Star } from "lucide-react";
import type { Producto } from "@/types/cms";

interface ProductCardProps {
  product: Producto;
}

const colorVariantMap: Record<string, "default" | "navy" | "orange" | "coral"> = {
  teal:   "default",
  navy:   "navy",
  orange: "orange",
  coral:  "coral",
};

export function ProductCard({ product }: ProductCardProps) {
  const category = product.categoria;
  const firstImage = product.imagenes[0]?.media ?? null;
  const badgeVariant = colorVariantMap[category?.color ?? "teal"] ?? "default";

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-brand-light-blue overflow-hidden">
        {firstImage?.url ? (
          <Image
            src={firstImage.url}
            alt={firstImage.alt || product.nombre}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-brand-teal/20 font-black uppercase">
              {product.nombre.slice(0, 2)}
            </span>
          </div>
        )}
        {product.destacado && (
          <div className="absolute top-3 left-3 bg-brand-yellow text-brand-navy text-xs font-black px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3" />
            Destacado
          </div>
        )}
      </div>

      <CardContent className="pt-4 flex flex-col flex-1 gap-3">
        {category && (
          <Badge variant={badgeVariant} className="w-fit text-xs">
            {category.nombre}
          </Badge>
        )}

        <h3 className="font-bold text-brand-navy leading-tight group-hover:text-brand-teal transition-colors">
          {product.nombre}
        </h3>

        {product.descripcionCorta && (
          <p className="text-sm text-gray-500 line-clamp-2 flex-1">
            {product.descripcionCorta}
          </p>
        )}

        <Link
          href={`/productos/${product.slug}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-auto w-full")}
        >
          Ver detalles
          <ChevronRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
