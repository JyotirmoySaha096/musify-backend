import { DataSource } from 'typeorm';
import { seed } from './seed';
import {
  User,
  Artist,
  Album,
  Song,
  Playlist,
  PlaylistSong,
  LikedSong,
} from '../entities';

async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'spotify',
    password: process.env.DB_PASSWORD || 'spotify_secret',
    database: process.env.DB_NAME || 'spotify_clone',
    entities: [User, Artist, Album, Song, Playlist, PlaylistSong, LikedSong],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Connected to database');

  await seed(dataSource);

  await dataSource.destroy();
  console.log('Seed complete!');
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
