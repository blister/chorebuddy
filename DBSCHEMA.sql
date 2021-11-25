CREATE TABLE `users` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`family_id` BIGINT UNSIGNED NOT NULL,
	`first` VARCHAR(50) NOT NULL,
	`last` VARCHAR(100) NOT NULL DEFAULT '',
	`email` VARCHAR(250) NOT NULL,
	`password` VARCHAR(200) NOT NULL DEFAULT '',
	`parent` TINYINT(1) NOT NULL DEFAULT 0,
	`admin` TINYINT(1) NOT NULL DEFAULT 0,
	PRIMARY KEY(`id`)
) Engine=InnoDB charset=utf8mb4;

CREATE TABLE `families` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL DEFAULT 'My Family',
	`plan` VARCHAR(50) NOT NULL DEFAULT 'free',
	`frequency` VARCHAR(20) NOT NULL DEFAULT 'weekly',
	PRIMARY KEY(`id`)
) Engine=InnoDB charset=utf8mb4;

CREATE TABLE `chores` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`family_id` BIGINT UNSIGNED NOT NULL,
	`name` VARCHAR(100) NOT NULL,
	`description` TEXT NULL,
	`value` BIGINT UNSIGNED NOT NULL DEFAULT 0,
	`assigned_to` BIGINT NULL,
	`frequency` VARCHAR(20) NOT NULL DEFAULT '', /* daily, weekly, monthly, '' */
	`repeat_on` VARCHAR(30) NOT NULL DEFAULT '', /* Sun,Mon,Tue,Wed,Thu,Fri,Sat */
	PRIMARY KEY(`id`),
	INDEX `family_idx` (`family_id`),
	INDEX `assigned_idx` (`assigned_to`)
) Engine=InnoDB charset=utf8mb4;

CREATE TABLE `chore_log` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`child_id` BIGINT UNSIGNED NOT NULL,
	`approver_id` BIGINT UNSIGNED NULL,
	`completed_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`approved_on` TIMESTAMP NULL,
	PRIMARY KEY(`id`),
	INDEX `completed_on_idx` (`completed_on`)
) Engine=InnoDB charset=utf8mb4;