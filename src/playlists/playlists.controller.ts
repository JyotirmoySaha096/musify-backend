import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto, AddSongToPlaylistDto } from './dto/playlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreatePlaylistDto) {
    return this.playlistsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUserPlaylists(@Request() req: any) {
    return this.playlistsService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/songs')
  addSong(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: AddSongToPlaylistDto,
  ) {
    return this.playlistsService.addSong(id, dto.songId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/songs/:songId')
  removeSong(
    @Param('id') id: string,
    @Param('songId') songId: string,
    @Request() req: any,
  ) {
    return this.playlistsService.removeSong(id, songId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.playlistsService.remove(id, req.user.id);
  }
}
