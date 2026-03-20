import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Song, Album, Artist } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Album, Artist])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
