CREATE TABLE "stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
