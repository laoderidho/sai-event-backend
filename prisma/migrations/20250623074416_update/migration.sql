/*
  Warnings:

  - Added the required column `conggregation_id` to the `lg_congregation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lg_congregation` ADD COLUMN `conggregation_id` INTEGER NOT NULL;
