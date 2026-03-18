import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const usuarios = sqliteTable("usuarios", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rol: text("rol", { enum: ["administrador", "editor"] }).notNull().default("editor"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const categorias = sqliteTable("categorias", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  descripcion: text("descripcion"),
  color: text("color", { enum: ["teal", "navy", "orange", "coral"] }).default("teal"),
  icono: text("icono"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  r2Key: text("r2_key").notNull(),
  alt: text("alt").notNull().default(""),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const productos = sqliteTable("productos", {
  id: text("id").primaryKey(),
  nombre: text("nombre").notNull(),
  slug: text("slug").notNull().unique(),
  categoriaId: text("categoria_id").references(() => categorias.id),
  estado: text("estado", { enum: ["publicado", "borrador", "archivado"] }).notNull().default("borrador"),
  destacado: integer("destacado", { mode: "boolean" }).notNull().default(false),
  descripcionCorta: text("descripcion_corta"),
  descripcion: text("descripcion"), // Lexical JSON string
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const productoImagenes = sqliteTable("producto_imagenes", {
  id: text("id").primaryKey(),
  productoId: text("producto_id").notNull().references(() => productos.id, { onDelete: "cascade" }),
  mediaId: text("media_id").notNull().references(() => media.id),
  orden: integer("orden").notNull().default(0),
});

export const especificaciones = sqliteTable("especificaciones", {
  id: text("id").primaryKey(),
  productoId: text("producto_id").notNull().references(() => productos.id, { onDelete: "cascade" }),
  clave: text("clave").notNull(),
  valor: text("valor").notNull(),
  orden: integer("orden").notNull().default(0),
});

export const caracteristicas = sqliteTable("caracteristicas", {
  id: text("id").primaryKey(),
  productoId: text("producto_id").notNull().references(() => productos.id, { onDelete: "cascade" }),
  texto: text("texto").notNull(),
  orden: integer("orden").notNull().default(0),
});

// Unused — kept for future pricing/inventory feature
export const precios = sqliteTable("precios", {
  id: text("id").primaryKey(),
  productoId: text("producto_id").notNull().references(() => productos.id, { onDelete: "cascade" }),
  precio: real("precio").notNull(),
  precioAnterior: real("precio_anterior"),
  stock: integer("stock").notNull().default(0),
  unidad: text("unidad").default("pieza"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
