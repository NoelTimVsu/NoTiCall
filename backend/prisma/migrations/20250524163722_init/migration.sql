/*
  Warnings:

  - The primary key for the `FriendShip` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "NotificationTypes" AS ENUM ('FRIEND_REQUEST', 'MESSAGE');

-- AlterTable
ALTER TABLE "FriendShip" DROP CONSTRAINT "FriendShip_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "FriendShip_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" "NotificationTypes" NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "actorId" INTEGER,
    "entityId" INTEGER,
    "entityType" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
