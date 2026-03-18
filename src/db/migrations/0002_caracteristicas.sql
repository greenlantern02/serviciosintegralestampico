CREATE TABLE `caracteristicas` (
  `id` text PRIMARY KEY NOT NULL,
  `producto_id` text NOT NULL REFERENCES productos(`id`) ON DELETE CASCADE,
  `texto` text NOT NULL,
  `orden` integer NOT NULL DEFAULT 0
);
