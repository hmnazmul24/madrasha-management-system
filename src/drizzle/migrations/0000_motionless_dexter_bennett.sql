CREATE TYPE "public"."course" AS ENUM('taishir', 'Mizan', 'Nahbemir', 'Hedayetun nahu', 'Kafiya', 'Shorhe jami', 'Shorhe bekaya', 'Jalalain ', 'Meshkat', 'Dawra', 'Moqtob', 'Qirat', 'Kitab', 'Hifz', 'Tajweed', 'Sarf', 'Nahw', 'Hadith', 'Fiqh', 'Aqidah', 'Tarikh (Islamic History)', 'Balagat', 'Mantiq', 'Usul al-Fiqh', 'Tafsir', 'Bangla', 'English', 'Gonit (Mathematics)', 'Biggan (Science)', 'Samajik Biggan (Social Science)', 'Computer', 'Business Studies', 'Sadharon Gyan (General Knowledge)');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."pass_status" AS ENUM('pass', 'fail', 'null');--> statement-breakpoint
CREATE TYPE "public"."session_range" AS ENUM('no_session', 'january_2023_december_2023', 'january_2024_december_2024', 'january_2025_december_2025', 'january_2026_december_2026', 'january_2027_december_2027', 'january_2028_december_2028', 'january_2029_december_2029', 'january_2030_december_2030');--> statement-breakpoint
CREATE TYPE "public"."donation_type" AS ENUM('General Donation', 'Zakat', 'Sadaqah', 'Monthly Donation', 'Fitra', 'One-Time Donation', 'Mosque Donation', 'Foreign Donation', 'Scholarship Donation', 'Organization Donation');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('Hand to Hand', 'bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Credit Card', 'Debit Card');--> statement-breakpoint
CREATE TYPE "public"."month" AS ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');--> statement-breakpoint
CREATE TYPE "public"."spending_field" AS ENUM('Electric bills', 'Religious Books', 'Educational Materials', 'Tech for Education', 'Library Resources', 'Building Maintenance', 'New Construction', 'Hygiene & Sanitation', 'Student Food & Housing', 'Student Aid', 'Medical Expenses', 'Student Supplies', 'Teacher Training', 'Office Supplies', 'Transportation', 'Community Programs', 'Charity Support', 'Community Education');--> statement-breakpoint
CREATE TYPE "public"."year" AS ENUM('2024', '2025', '2026', '2027', '2028', '2029', '2030');--> statement-breakpoint
CREATE TABLE "student_fees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_fees" integer NOT NULL,
	"education_fees" integer NOT NULL,
	"month" text NOT NULL,
	"year" text,
	"student_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"madrasha_id" uuid NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"image_public_id" text,
	"father_name" text,
	"mother_name" text,
	"course" "course" DEFAULT 'Moqtob' NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" "gender" NOT NULL,
	"session_range" "session_range" DEFAULT 'january_2025_december_2025' NOT NULL,
	"address" text,
	"physical_condition" text DEFAULT 'normal',
	"admission_time_paid" integer DEFAULT 0,
	"student_id_no" integer NOT NULL,
	"pass_status" "pass_status" DEFAULT 'null',
	"result" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donation_type" "donation_type" NOT NULL,
	"is_money" text NOT NULL,
	"amount" integer,
	"donation_details" text NOT NULL,
	"donor_name" varchar(255) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"amount_paid" integer NOT NULL,
	"bonus" integer DEFAULT 0,
	"payment_method" "payment_method" NOT NULL,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"education_des" text NOT NULL,
	"image_url" text,
	"image_public_id" text,
	"salary_amount" integer NOT NULL,
	"total_paid" integer DEFAULT 0,
	"last_paid_at" timestamp,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spendings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spending_field" "spending_field" NOT NULL,
	"month" "month" NOT NULL,
	"year" "year" NOT NULL,
	"amount" integer NOT NULL,
	"spending_details" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "madrasha" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instititution_name" text NOT NULL,
	"owner_name" text NOT NULL,
	"contact_number" text NOT NULL,
	"address" text NOT NULL,
	"one_time_paid" integer NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"disabled" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "madrasha_instititution_name_unique" UNIQUE("instititution_name")
);
--> statement-breakpoint
ALTER TABLE "student_fees" ADD CONSTRAINT "student_fees_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_madrasha_id_madrasha_id_fk" FOREIGN KEY ("madrasha_id") REFERENCES "public"."madrasha"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_payments" ADD CONSTRAINT "salary_payments_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE cascade ON UPDATE no action;