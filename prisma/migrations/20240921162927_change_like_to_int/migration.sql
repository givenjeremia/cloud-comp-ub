/*
  Warnings:

  - You are about to alter the column `dislike` on the `baby_names` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Int`.
  - You are about to alter the column `like` on the `baby_names` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Int`.

*/
-- AlterTable
ALTER TABLE `baby_names` MODIFY `dislike` INTEGER NULL,
    MODIFY `like` INTEGER NULL;
