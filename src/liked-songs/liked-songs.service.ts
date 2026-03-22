import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class LikedSongsService {
  constructor(private db: DatabaseService) {}

  async findByUser(userId: string) {
    const { LikedSong, Song, Artist, Album } = this.db.models as any;
    const liked = await LikedSong.findAll({
      where: { userId },
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
      order: [['likedAt', 'DESC']],
    });
    return liked.map((ls: any) => ({
      ...(ls.song?.toJSON?.() ?? ls.song),
      likedAt: ls.likedAt,
    }));
  }

  async like(userId: string, songId: string) {
    const { LikedSong } = this.db.models as any;
    const existing = await LikedSong.findOne({ where: { userId, songId } });
    if (existing) {
      return { liked: true };
    }
    await LikedSong.create({ userId, songId });
    return { liked: true };
  }

  async unlike(userId: string, songId: string) {
    const { LikedSong } = this.db.models as any;
    await LikedSong.destroy({ where: { userId, songId } });
    return { liked: false };
  }
}
