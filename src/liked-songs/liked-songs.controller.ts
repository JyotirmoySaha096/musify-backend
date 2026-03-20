import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LikedSongsService } from './liked-songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('liked-songs')
export class LikedSongsController {
  constructor(private likedSongsService: LikedSongsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    return this.likedSongsService.findByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':songId')
  like(@Param('songId') songId: string, @Request() req: any) {
    return this.likedSongsService.like(req.user.id, songId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':songId')
  unlike(@Param('songId') songId: string, @Request() req: any) {
    return this.likedSongsService.unlike(req.user.id, songId);
  }
}
