import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist, PlaylistSong } from '../entities';
import { CreatePlaylistDto } from './dto/playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
    @InjectRepository(PlaylistSong)
    private playlistSongsRepository: Repository<PlaylistSong>,
  ) {}

  async create(userId: string, dto: CreatePlaylistDto) {
    const playlist = this.playlistsRepository.create({
      name: dto.name,
      coverUrl: dto.coverUrl,
      userId,
    });
    return this.playlistsRepository.save(playlist);
  }

  async findByUser(userId: string) {
    return this.playlistsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: [
        'user',
        'playlistSongs',
        'playlistSongs.song',
        'playlistSongs.song.artist',
        'playlistSongs.song.album',
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
    const playlist = await this.playlistsRepository.findOne({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    // Get max position
    const maxPos = await this.playlistSongsRepository
      .createQueryBuilder('ps')
      .where('ps.playlist_id = :playlistId', { playlistId })
      .select('MAX(ps.position)', 'max')
      .getRawOne();

    const position = (maxPos?.max ?? -1) + 1;

    const playlistSong = this.playlistSongsRepository.create({
      playlistId,
      songId,
      position,
    });

    await this.playlistSongsRepository.save(playlistSong);
    return this.findOne(playlistId);
  }

  async removeSong(playlistId: string, songId: string, userId: string) {
    const playlist = await this.playlistsRepository.findOne({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    await this.playlistSongsRepository.delete({ playlistId, songId });
    return this.findOne(playlistId);
  }

  async remove(playlistId: string, userId: string) {
    const playlist = await this.playlistsRepository.findOne({
      where: { id: playlistId },
    });
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }
    await this.playlistsRepository.delete(playlistId);
    return { deleted: true };
  }
}
