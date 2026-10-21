CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`location` text NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`eventbriteUrl` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
