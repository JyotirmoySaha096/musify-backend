import { DataSource } from 'typeorm';
import { Artist, Album, Song } from '../entities';
import * as path from 'path';

const AUDIO_DIR = path.resolve(__dirname, '..', '..', 'assets', 'audio');

export async function seed(dataSource: DataSource) {
  const artistRepo = dataSource.getRepository(Artist);
  const albumRepo = dataSource.getRepository(Album);
  const songRepo = dataSource.getRepository(Song);

  // Check if already seeded
  const existingArtists = await artistRepo.count();
  if (existingArtists > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  // Create artists
  const artists = await artistRepo.save([
    {
      name: 'Midnight Echo',
      bio: 'An electronic music duo known for atmospheric synth-wave sounds and dreamy melodies.',
      imageUrl: '/images/artists/midnight-echo.jpg',
    },
    {
      name: 'Solar Drift',
      bio: 'Indie rock band blending shoegaze textures with catchy pop hooks.',
      imageUrl: '/images/artists/solar-drift.jpg',
    },
    {
      name: 'Luna Vega',
      bio: 'Neo-soul vocalist weaving R&B grooves with jazz harmonies.',
      imageUrl: '/images/artists/luna-vega.jpg',
    },
    {
      name: 'Crystal Cascade',
      bio: 'Ambient electronic producer creating lush, immersive soundscapes.',
      imageUrl: '/images/artists/crystal-cascade.jpg',
    },
    {
      name: 'The Velvet Currents',
      bio: 'Alternative rock group with psychedelic influences and powerful live performances.',
      imageUrl: '/images/artists/velvet-currents.jpg',
    },
    {
      name: 'Neon Horizon',
      bio: 'Synthwave producer crafting retro-futuristic soundtracks for the modern age.',
      imageUrl: '/images/artists/neon-horizon.jpg',
    },
  ]);

  // Create albums
  const albums = await albumRepo.save([
    {
      title: 'Neon Dreams',
      coverUrl: '/images/albums/neon-dreams.jpg',
      releaseYear: 2024,
      artistId: artists[0].id,
    },
    {
      title: 'Echoes of Tomorrow',
      coverUrl: '/images/albums/echoes-of-tomorrow.jpg',
      releaseYear: 2023,
      artistId: artists[0].id,
    },
    {
      title: 'Sunlit Reverie',
      coverUrl: '/images/albums/sunlit-reverie.jpg',
      releaseYear: 2024,
      artistId: artists[1].id,
    },
    {
      title: 'Golden Hour',
      coverUrl: '/images/albums/golden-hour.jpg',
      releaseYear: 2023,
      artistId: artists[2].id,
    },
    {
      title: 'Moonlit Waters',
      coverUrl: '/images/albums/moonlit-waters.jpg',
      releaseYear: 2024,
      artistId: artists[2].id,
    },
    {
      title: 'Deep Frequencies',
      coverUrl: '/images/albums/deep-frequencies.jpg',
      releaseYear: 2024,
      artistId: artists[3].id,
    },
    {
      title: 'Electric Currents',
      coverUrl: '/images/albums/electric-currents.jpg',
      releaseYear: 2023,
      artistId: artists[4].id,
    },
    {
      title: 'Retrowave City',
      coverUrl: '/images/albums/retrowave-city.jpg',
      releaseYear: 2024,
      artistId: artists[5].id,
    },
  ]);

  // Create songs — each song uses a sample audio file
  const sampleFile = path.join(AUDIO_DIR, 'sample.mp3');

  const songsData = [
    // Neon Dreams
    { title: 'Midnight Drive', albumId: albums[0].id, artistId: artists[0].id, trackNumber: 1, durationSeconds: 234 },
    { title: 'City Lights', albumId: albums[0].id, artistId: artists[0].id, trackNumber: 2, durationSeconds: 198 },
    { title: 'Neon Pulse', albumId: albums[0].id, artistId: artists[0].id, trackNumber: 3, durationSeconds: 267 },
    { title: 'Digital Rain', albumId: albums[0].id, artistId: artists[0].id, trackNumber: 4, durationSeconds: 312 },
    { title: 'After Hours', albumId: albums[0].id, artistId: artists[0].id, trackNumber: 5, durationSeconds: 225 },
    // Echoes of Tomorrow
    { title: 'First Light', albumId: albums[1].id, artistId: artists[0].id, trackNumber: 1, durationSeconds: 189 },
    { title: 'Distant Memories', albumId: albums[1].id, artistId: artists[0].id, trackNumber: 2, durationSeconds: 256 },
    { title: 'Time Capsule', albumId: albums[1].id, artistId: artists[0].id, trackNumber: 3, durationSeconds: 278 },
    { title: 'Future Echoes', albumId: albums[1].id, artistId: artists[0].id, trackNumber: 4, durationSeconds: 301 },
    // Sunlit Reverie
    { title: 'Morning Dew', albumId: albums[2].id, artistId: artists[1].id, trackNumber: 1, durationSeconds: 212 },
    { title: 'Daydream Waltz', albumId: albums[2].id, artistId: artists[1].id, trackNumber: 2, durationSeconds: 245 },
    { title: 'Summer Haze', albumId: albums[2].id, artistId: artists[1].id, trackNumber: 3, durationSeconds: 198 },
    { title: 'Warm Breeze', albumId: albums[2].id, artistId: artists[1].id, trackNumber: 4, durationSeconds: 267 },
    { title: 'Golden Fields', albumId: albums[2].id, artistId: artists[1].id, trackNumber: 5, durationSeconds: 289 },
    // Golden Hour
    { title: 'Velvet Night', albumId: albums[3].id, artistId: artists[2].id, trackNumber: 1, durationSeconds: 234 },
    { title: 'Silk & Honey', albumId: albums[3].id, artistId: artists[2].id, trackNumber: 2, durationSeconds: 267 },
    { title: 'Amber Glow', albumId: albums[3].id, artistId: artists[2].id, trackNumber: 3, durationSeconds: 223 },
    { title: 'Twilight Serenade', albumId: albums[3].id, artistId: artists[2].id, trackNumber: 4, durationSeconds: 298 },
    // Moonlit Waters
    { title: 'Lunar Tides', albumId: albums[4].id, artistId: artists[2].id, trackNumber: 1, durationSeconds: 312 },
    { title: 'Starlit Shore', albumId: albums[4].id, artistId: artists[2].id, trackNumber: 2, durationSeconds: 245 },
    { title: 'Midnight Bloom', albumId: albums[4].id, artistId: artists[2].id, trackNumber: 3, durationSeconds: 278 },
    // Deep Frequencies
    { title: 'Underwater Cathedral', albumId: albums[5].id, artistId: artists[3].id, trackNumber: 1, durationSeconds: 456 },
    { title: 'Crystal Caves', albumId: albums[5].id, artistId: artists[3].id, trackNumber: 2, durationSeconds: 389 },
    { title: 'Aurora Borealis', albumId: albums[5].id, artistId: artists[3].id, trackNumber: 3, durationSeconds: 412 },
    { title: 'Ocean Floor', albumId: albums[5].id, artistId: artists[3].id, trackNumber: 4, durationSeconds: 367 },
    // Electric Currents
    { title: 'Thunder Road', albumId: albums[6].id, artistId: artists[4].id, trackNumber: 1, durationSeconds: 234 },
    { title: 'Voltage', albumId: albums[6].id, artistId: artists[4].id, trackNumber: 2, durationSeconds: 198 },
    { title: 'Storm Chaser', albumId: albums[6].id, artistId: artists[4].id, trackNumber: 3, durationSeconds: 267 },
    { title: 'Lightning Strike', albumId: albums[6].id, artistId: artists[4].id, trackNumber: 4, durationSeconds: 289 },
    { title: 'Power Surge', albumId: albums[6].id, artistId: artists[4].id, trackNumber: 5, durationSeconds: 312 },
    // Retrowave City
    { title: 'Cybernetic Dawn', albumId: albums[7].id, artistId: artists[5].id, trackNumber: 1, durationSeconds: 256 },
    { title: 'Chrome Highway', albumId: albums[7].id, artistId: artists[5].id, trackNumber: 2, durationSeconds: 223 },
    { title: 'Digital Sunset', albumId: albums[7].id, artistId: artists[5].id, trackNumber: 3, durationSeconds: 289 },
    { title: 'Pixel Dreams', albumId: albums[7].id, artistId: artists[5].id, trackNumber: 4, durationSeconds: 312 },
    { title: 'Neon Skyline', albumId: albums[7].id, artistId: artists[5].id, trackNumber: 5, durationSeconds: 267 },
  ];

  const songs = songsData.map((s) =>
    songRepo.create({
      ...s,
      filePath: sampleFile,
    }),
  );

  await songRepo.save(songs);

  console.log(`✓ Seeded ${artists.length} artists`);
  console.log(`✓ Seeded ${albums.length} albums`);
  console.log(`✓ Seeded ${songs.length} songs`);
}
