/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_subject` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hobbies` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "favorite_subject",
DROP COLUMN "gender",
DROP COLUMN "hobbies",
DROP COLUMN "name",
ADD COLUMN     "used_input_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "used_output_tokens" INTEGER NOT NULL DEFAULT 0;
