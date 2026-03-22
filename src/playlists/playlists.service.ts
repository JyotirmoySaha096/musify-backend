import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlaylistDto } from './dto/playlist.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PlaylistsService {
  constructor(private db: DatabaseService) {}

  async create(userId: string, dto: CreatePlaylistDto) {
    const { Playlist } = this.db.models as any;
    return Playlist.create({
      id: uuidv4(),
      name: dto.name,
      coverUrl: dto.coverUrl,
      userId,
    });
  }

  async findByUser(userId: string) {
    const { Playlist } = this.db.models as any;
    return Playlist.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string) {
    const { Playlist, PlaylistSong, User, Song, Artist, Album } = this.db.models as any;
    const playlist = await Playlist.findOne({
      where: { id },
      include: [
        { model: User, as: 'user' },
        {
          model: PlaylistSong,
          as: 'playlistSongs',
          include: [
            {
              model: Song,
              as: 'song',
              include: [
                { model: Artist, as: 'artist' },
                { model: Album, as: 'album' },
              ],
            },
          ],
        },
      ],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    // Sort by position and map to cleaner format
    if (playlist.playlistSongs) {
      playlist.playlistSongs.sort((a, b) => a.position - b.position);
    }

    return playlist;
  }

  async addSong(playlistId: string, songId: string, userId: string) {
    const { Playlist, PlaylistSong } = this.db.models as any;
    const playlist = await Playlist.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    // Get max position
    const maxPos = await PlaylistSong.findOne({
      where: { playlistId },
      attributes: [[Sequelize.fn('MAX', Sequelize.col('position')), 'max']],
      raw: true,
    });
    const position = (maxPos?.max ?? -1) + 1;

    await PlaylistSong.create({
      playlistId,
      songId,
      position,
    });
    return this.findOne(playlistId);
  }

  async removeSong(playlistId: string, songId: string, userId: string) {
    const { Playlist, PlaylistSong } = this.db.models as any;
    const playlist = await Playlist.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    await PlaylistSong.destroy({ where: { playlistId, songId } });
    return this.findOne(playlistId);
  }

  async remove(playlistId: string, userId: string) {
    const { Playlist } = this.db.models as any;
    const playlist = await Playlist.findOne({ where: { id: playlistId } });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }
    await Playlist.destroy({ where: { id: playlistId } });
    return { deleted: true };
  }
}
