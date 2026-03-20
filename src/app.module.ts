import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SearchModule } from './search/search.module';
import { LikedSongsModule } from './liked-songs/liked-songs.module';
import {
  User,
  Artist,
  Album,
  Song,
  Playlist,
  PlaylistSong,
  LikedSong,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'spotify',
      password: process.env.DB_PASSWORD || 'spotify_secret',
      database: process.env.DB_NAME || 'spotify_clone',
      entities: [User, Artist, Album, Song, Playlist, PlaylistSong, LikedSong],
      synchronize: true,
    }),
    AuthModule,
    SongsModule,
    AlbumsModule,
    ArtistsModule,
    PlaylistsModule,
    SearchModule,
    LikedSongsModule,
  ],
})
export class AppModule {}
