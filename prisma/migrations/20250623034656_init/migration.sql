/*
  Warnings:

  - You are about to drop the column `action` on the `lg_congregation` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `lg_region` table. All the data in the column will be lost.
  - Added the required column `action_id` to the `lg_congregation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action_id` to the `lg_region` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lg_congregation` DROP COLUMN `action`,
    ADD COLUMN `action_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `lg_region` DROP COLUMN `action`,
    ADD COLUMN `action_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `status_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lg_congregation` ADD CONSTRAINT `lg_congregation_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `status_log`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lg_region` ADD CONSTRAINT `lg_region_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `status_log`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
