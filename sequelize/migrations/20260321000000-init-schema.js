'use strict';

/**
 * Initial schema migration for the Spotify clone.
 *
 * Important: this is written to be non-destructive and safe to run against an
 * existing database by using `CREATE TABLE IF NOT EXISTS` and avoiding drops.
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    // Core entities
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid NOT NULL PRIMARY KEY,
        email varchar(255) NOT NULL,
        username varchar(255) NOT NULL,
        "passwordHash" varchar(255) NOT NULL,
        "avatarUrl" varchar(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        UNIQUE (email),
        UNIQUE (username)
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS artists (
        id uuid NOT NULL PRIMARY KEY,
        name varchar(255) NOT NULL,
        bio text,
        "imageUrl" varchar(255)
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS albums (
        id uuid NOT NULL PRIMARY KEY,
        title varchar(255) NOT NULL,
        "coverUrl" varchar(255),
        "releaseYear" integer,
        artist_id uuid NOT NULL,
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS songs (
        id uuid NOT NULL PRIMARY KEY,
        title varchar(255) NOT NULL,
        duration_seconds integer NOT NULL,
        audio_url text NOT NULL,
        track_number integer,
        album_id uuid NOT NULL,
        artist_id uuid NOT NULL,
        FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS playlists (
        id uuid NOT NULL PRIMARY KEY,
        name varchar(255) NOT NULL,
        "coverUrl" varchar(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        user_id uuid NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Join tables
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS playlist_songs (
        playlist_id uuid NOT NULL,
        song_id uuid NOT NULL,
        position integer NOT NULL DEFAULT 0,
        "addedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY (playlist_id, song_id),
        FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
      );
    `);

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS liked_songs (
        user_id uuid NOT NULL,
        song_id uuid NOT NULL,
        "likedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, song_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
      );
    `);
  },

  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;
    await sequelize.query('DROP TABLE IF EXISTS liked_songs CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS playlist_songs CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS playlists CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS songs CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS albums CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS artists CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE;');
  },
};

