/*
  Warnings:

  - Added the required column `region_id` to the `lg_region` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lg_region` ADD COLUMN `region_id` INTEGER NOT NULL;
