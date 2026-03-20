import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikedSong } from '../entities';

@Injectable()
export class LikedSongsService {
  constructor(
    @InjectRepository(LikedSong)
    private likedSongsRepository: Repository<LikedSong>,
  ) {}

  async findByUser(userId: string) {
    const liked = await this.likedSongsRepository.find({
      where: { userId },
      relations: ['song', 'song.artist', 'song.album'],
      order: { likedAt: 'DESC' },
    });
    return liked.map((ls) => ({
      ...ls.song,
      likedAt: ls.likedAt,
    }));
  }

  async like(userId: string, songId: string) {
    const existing = await this.likedSongsRepository.findOne({
      where: { userId, songId },
    });
    if (existing) {
      return { liked: true };
    }
    const likedSong = this.likedSongsRepository.create({ userId, songId });
    await this.likedSongsRepository.save(likedSong);
    return { liked: true };
  }

  async unlike(userId: string, songId: string) {
    await this.likedSongsRepository.delete({ userId, songId });
    return { liked: false };
  }
}
