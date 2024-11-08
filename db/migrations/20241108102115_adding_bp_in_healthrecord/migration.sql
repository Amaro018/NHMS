-- AlterTable
ALTER TABLE `healthrecord` ADD COLUMN `bloodPressureStatus` VARCHAR(191) NULL,
    ADD COLUMN `diastolic` INTEGER NULL,
    ADD COLUMN `systolic` INTEGER NULL;
