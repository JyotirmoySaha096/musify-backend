import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikedSongsService } from './liked-songs.service';
import { LikedSongsController } from './liked-songs.controller';
import { LikedSong } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([LikedSong])],
  controllers: [LikedSongsController],
  providers: [LikedSongsService],
  exports: [LikedSongsService],
})
export class LikedSongsModule {}
