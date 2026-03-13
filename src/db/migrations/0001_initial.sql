CREATE TABLE `usuarios` (
  `id` text PRIMARY KEY NOT NULL,
  `nombre` text NOT NULL,
  `email` text NOT NULL UNIQUE,
  `password_hash` text NOT NULL,
  `rol` text NOT NULL DEFAULT 'editor',
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `categorias` (
  `id` text PRIMARY KEY NOT NULL,
  `nombre` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `descripcion` text,
  `color` text DEFAULT 'teal',
  `icono` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `media` (
  `id` text PRIMARY KEY NOT NULL,
  `filename` text NOT NULL,
  `url` text NOT NULL,
  `r2_key` text NOT NULL,
  `alt` text NOT NULL DEFAULT '',
  `mime_type` text NOT NULL,
  `size` integer NOT NULL,
  `width` integer,
  `height` integer,
  `created_at` integer NOT NULL
);

CREATE TABLE `productos` (
  `id` text PRIMARY KEY NOT NULL,
  `nombre` text NOT NULL,
  `slug` text NOT NULL UNIQUE,
  `categoria_id` text REFERENCES categorias(`id`),
  `estado` text NOT NULL DEFAULT 'borrador',
  `destacado` integer NOT NULL DEFAULT 0,
  `descripcion_corta` text,
  `descripcion` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `producto_imagenes` (
  `id` text PRIMARY KEY NOT NULL,
  `producto_id` text NOT NULL REFERENCES productos(`id`) ON DELETE CASCADE,
  `media_id` text NOT NULL REFERENCES media(`id`),
  `orden` integer NOT NULL DEFAULT 0
);

CREATE TABLE `especificaciones` (
  `id` text PRIMARY KEY NOT NULL,
  `producto_id` text NOT NULL REFERENCES productos(`id`) ON DELETE CASCADE,
  `clave` text NOT NULL,
  `valor` text NOT NULL,
  `orden` integer NOT NULL DEFAULT 0
);

CREATE TABLE `precios` (
  `id` text PRIMARY KEY NOT NULL,
  `producto_id` text NOT NULL REFERENCES productos(`id`) ON DELETE CASCADE,
  `precio` real NOT NULL,
  `precio_anterior` real,
  `stock` integer NOT NULL DEFAULT 0,
  `unidad` text DEFAULT 'pieza',
  `updated_at` integer NOT NULL
);
