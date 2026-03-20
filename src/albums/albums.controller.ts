import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlbumsService } from './albums.service';

@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.albumsService.findAll(limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }
}
