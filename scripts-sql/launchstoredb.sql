-- DROP DATABASE "launchstoredb" 
-- CREATE DATABASE "launchstoredb";

-- CREATE TABLES --
CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "reset_token" text,
  "reset_token_expires" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "seller_id" int NOT NULL,
  "buyer_id" int NOT NULL,
  "product_id" int NOT NULL,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "total" int NOT NULL,
  "status" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
  );

-- TRIGGERS AND PROCEDURES -- 
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- UPDATE ROW UPDATED_AT OF TABLE USERS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- UPDATE ROW UPDATED_AT OF TABLE PRODUCTS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- UPDATE ROW UPDATED_AT OF TABLE ORDERS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- CONNECT PG SIMPLE TABLE

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- CASCADE EFFECT WHEN DELETE USER AND PRODUCTS

ALTER TABLE "products"
ADD CONSTRAINT products_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "files"
ADD CONSTRAINT files_product_id_fkey
FOREIGN KEY ("product_id")
REFERENCES "products" ("id")
ON DELETE CASCADE;

-- FOREIGN KEY FOR ORDERS
ALTER TABLE "orders"
ADD FOREIGN KEY ("seller_id")
REFERENCES "users" ("id");

ALTER TABLE "orders"
ADD FOREIGN KEY ("buyer_id")
REFERENCES "users" ("id");

ALTER TABLE "orders"
ADD FOREIGN KEY ("product_id")
REFERENCES "products" ("id");

-- TO RUN SEEDS
DELETE FROM products;
DELETE FROM users;
DELETE FROM files;

-- RESTART SEQUENCE AUTO_INCREMENT FROM TABLES IDS
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;

-- INSERT VALUES ON TABLE CATEGORIES
INSERT INTO CATEGORIES (name) VALUES ('Acessórios para Veículos');
INSERT INTO CATEGORIES (name) VALUES ('Aces. de Carros e Caminhonetes');
INSERT INTO CATEGORIES (name) VALUES ('Aces. de Motos e Quadriciclos');

-- ESTRATEGY OF SOFT DELETE ON DB
CREATE OR REPLACE RULE delete_product AS
ON DELETE TO products DO INSTEAD
UPDATE products
SET deleted_at = now()
where products.id = old.id;

CREATE VIEW products_without_deleted AS
SELECT * FROM products WHERE deleted_at IS NULL;

ALTER TABLE products RENAME TO product_with_deleted;
ALTER TABLE products_without_deleted RENAME TO products;

  
