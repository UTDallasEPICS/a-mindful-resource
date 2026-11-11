CREATE TABLE `village_member` (
	`userId` text PRIMARY KEY NOT NULL,
	`phoneNumber` text,
	`credentials` text,
	`organization` text,
	`city` text,
	`preferredContactMethod` text,
	`website` text,
	`reasonForJoining` text,
	`availability` text DEFAULT 'available' NOT NULL,
	`applicationStatus` text DEFAULT 'pending' NOT NULL,
	`reviewedBy` text,
	`reviewedAt` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`reviewedBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `village_member_applicationStatus_idx` ON `village_member` (`applicationStatus`);--> statement-breakpoint
CREATE TABLE `village_member_role` (
	`userId` text NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`userId`, `role`),
	FOREIGN KEY (`userId`) REFERENCES `village_member`(`userId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `village_member_role_role_idx` ON `village_member_role` (`role`);--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'user' NOT NULL;