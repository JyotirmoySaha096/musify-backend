import { Controller, Get, Param, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';

@Controller('artists')
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.artistsService.findAll(limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistsService.findOne(id);
  }
}
