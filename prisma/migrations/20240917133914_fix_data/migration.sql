-- DropIndex
DROP INDEX `baby_names_name_key` ON `baby_names`;

-- AlterTable
ALTER TABLE `baby_names` MODIFY `name` TEXT NOT NULL;
