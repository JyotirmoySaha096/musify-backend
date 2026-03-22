import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SearchModule } from './search/search.module';
import { LikedSongsModule } from './liked-songs/liked-songs.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
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
