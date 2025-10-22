CREATE TYPE "public"."recruit_status" AS ENUM('Submitted', 'Confirmed');--> statement-breakpoint
CREATE TABLE "recruiter_leaders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recruiter_leaders_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "recruiter_points" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type_id" varchar NOT NULL,
	"points" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recruiter_points_type_id_unique" UNIQUE("type_id")
);
--> statement-breakpoint
CREATE TABLE "recruiter_recruits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"leader_id" varchar NOT NULL,
	"type_id" varchar NOT NULL,
	"date" timestamp NOT NULL,
	"mobile" text NOT NULL,
	"email" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'Submitted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recruiter_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recruiter_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "recruiter_types" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recruiter_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'hr' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "recruiter_points" ADD CONSTRAINT "recruiter_points_type_id_recruiter_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."recruiter_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_recruits" ADD CONSTRAINT "recruiter_recruits_leader_id_recruiter_leaders_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."recruiter_leaders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruiter_recruits" ADD CONSTRAINT "recruiter_recruits_type_id_recruiter_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."recruiter_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;