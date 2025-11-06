CREATE TABLE "mantras" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mantra_id" varchar,
	"title" text NOT NULL,
	"genre" text NOT NULL,
	"lyrics" text NOT NULL,
	"audio_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"playlist_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "songs_mantra_id_mantras_id_fk" FOREIGN KEY ("mantra_id") REFERENCES "public"."mantras"("id") ON DELETE no action ON UPDATE no action;