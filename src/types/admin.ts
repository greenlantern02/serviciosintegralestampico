import type { CategoriaColor, ProductoEstado, UsuarioRol } from "@/types/cms";

export type SessionPayload = {
  userId: string;
  email: string;
  nombre: string;
  rol: UsuarioRol;
};

export type DashboardStats = {
  totalProductos: number;
  totalCategorias: number;
  totalMedia: number;
  productosPorEstado: Record<ProductoEstado, number>;
};

export type AdminCategoriaForm = {
  nombre: string;
  slug: string;
  descripcion: string;
  color: CategoriaColor;
  icono: string;
};

export type AdminProductoForm = {
  nombre: string;
  slug: string;
  categoriaId: string;
  estado: ProductoEstado;
  destacado: boolean;
  descripcionCorta: string;
  descripcion: string; // Lexical JSON string
  imagenes: Array<{ mediaId: string; orden: number }>;
  especificaciones: Array<{ clave: string; valor: string; orden: number }>;
  caracteristicas: Array<{ texto: string; orden: number }>;
  precio: number;
  precioAnterior: number | null;
  stock: number;
  unidad: string;
};
