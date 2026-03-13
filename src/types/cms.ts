export type CategoriaColor = "teal" | "navy" | "orange" | "coral";
export type ProductoEstado = "publicado" | "borrador" | "archivado";
export type UsuarioRol = "administrador" | "editor";

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  r2Key: string;
  alt: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: Date;
};

export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: CategoriaColor | null;
  icono: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductoImagen = {
  id: string;
  productoId: string;
  mediaId: string;
  media: MediaItem;
  orden: number;
};

export type Especificacion = {
  id: string;
  productoId: string;
  clave: string;
  valor: string;
  orden: number;
};

export type Precio = {
  id: string;
  productoId: string;
  precio: number;
  precioAnterior: number | null;
  stock: number;
  unidad: string | null;
  updatedAt: Date;
};

export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  categoriaId: string | null;
  categoria: Categoria | null;
  estado: ProductoEstado;
  destacado: boolean;
  descripcionCorta: string | null;
  descripcion: string | null; // Lexical JSON string
  imagenes: ProductoImagen[];
  especificaciones: Especificacion[];
  precio: Precio | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  createdAt: Date;
  updatedAt: Date;
};
