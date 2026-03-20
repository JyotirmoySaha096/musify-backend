import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  Header,
  Req,
  Query,
} from '@nestjs/common';
import type { Response, Request } from 'express';
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

  @Get(':id/stream')
  @Header('Accept-Ranges', 'bytes')
  async stream(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const song = await this.songsService.findOne(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return this.songsService.streamFile(song.filePath, req, res);
  }
}
