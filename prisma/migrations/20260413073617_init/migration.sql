-- CreateTable
CREATE TABLE "Matrix" (
    "id" SERIAL NOT NULL,
    "userId" TEXT,
    "data" JSONB NOT NULL,
    "time" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matrix_pkey" PRIMARY KEY ("id")
);
