CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"repo_url" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'queued' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
