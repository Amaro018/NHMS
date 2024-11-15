/*
  Warnings:

  - You are about to drop the column `targetHealthStatus` on the `healthproject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `healthproject` DROP COLUMN `targetHealthStatus`;

-- CreateTable
CREATE TABLE `HealthStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statusName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HealthStatus_statusName_key`(`statusName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectHealthStatuses` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProjectHealthStatuses_AB_unique`(`A`, `B`),
    INDEX `_ProjectHealthStatuses_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProjectHealthStatuses` ADD CONSTRAINT `_ProjectHealthStatuses_A_fkey` FOREIGN KEY (`A`) REFERENCES `HealthProject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectHealthStatuses` ADD CONSTRAINT `_ProjectHealthStatuses_B_fkey` FOREIGN KEY (`B`) REFERENCES `HealthStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
