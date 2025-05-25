-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "message" TEXT,
    "songTitle" TEXT NOT NULL,
    "songArtist" TEXT NOT NULL,
    "songImageUrl" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Recommendation_user_id_idx" ON "Recommendation"("user_id");

-- CreateTable
CREATE TABLE "RecommendationHistory" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "songArtist" TEXT NOT NULL,
    "songImageUrl" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RecommendationHistory_user_id_idx" ON "RecommendationHistory"("user_id");

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "songArtist" TEXT NOT NULL,
    "songImageUrl" TEXT NOT NULL,
    "spotifyUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorite_user_id_idx" ON "Favorite"("user_id");
