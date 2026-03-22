import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private songsService: SongsService) { }

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.songsService.findAll(limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }
}
