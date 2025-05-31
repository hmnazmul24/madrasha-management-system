ALTER TABLE "donations" ADD COLUMN "madrasha_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "spendings" ADD COLUMN "madrasha_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_madrasha_id_madrasha_id_fk" FOREIGN KEY ("madrasha_id") REFERENCES "public"."madrasha"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spendings" ADD CONSTRAINT "spendings_madrasha_id_madrasha_id_fk" FOREIGN KEY ("madrasha_id") REFERENCES "public"."madrasha"("id") ON DELETE cascade ON UPDATE no action;