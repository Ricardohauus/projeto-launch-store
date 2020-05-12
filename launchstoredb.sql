CREATE TABLE "products" (
  "id" "int(pk, increment)",
  "category_id" unique,
  "user_id" unique,
  "name" text,
  "description" text,
  "old_price" int,
  "price" int,
  "quantity" int,
  "status" int,
  "created_at" timestamp DEFAULT 'now()',
  "updated_at" timestamp DEFAULT 'now()'
);

CREATE TABLE "categories" (
  "id" "int(pk, increment)",
  "name" text
);

CREATE TABLE "files" (
  "id" "int(pk, increment)",
  "name" text,
  "path" text,
  "product_id" int UNIQUE
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
