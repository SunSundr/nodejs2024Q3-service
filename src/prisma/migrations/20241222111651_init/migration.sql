-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "login" VARCHAR NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "updatedAt" BIGINT NOT NULL,

    CONSTRAINT "PK_Users_Id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR NOT NULL,
    "year" INTEGER,
    "artistId" UUID,

    CONSTRAINT "PK_Albums_Id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR NOT NULL,
    "grammy" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PK_Artists_Id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR NOT NULL,
    "artistId" UUID,
    "albumId" UUID,
    "duration" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PK_Tracks_Id" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_typeorm_migrations" (
    "id" SERIAL NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "PK__typeorm_migrations_Id" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IX_Users_Login" ON "user"("login");

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "FK_Albums_Artists" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "album" ADD CONSTRAINT "FK_Albums_Users" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artist" ADD CONSTRAINT "FK_Artists_Users" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track" ADD CONSTRAINT "FK_Tracks_Albums" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track" ADD CONSTRAINT "FK_Tracks_Artists" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track" ADD CONSTRAINT "FK_Tracks_Users" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

