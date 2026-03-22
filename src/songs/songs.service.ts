import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SongsService {
  constructor(private db: DatabaseService) {}

  async findAll(limit?: number) {
    const { Song, Artist, Album } = this.db.models as any;
    return Song.findAll({
      include: [
        { model: Artist, as: 'artist' },
        { model: Album, as: 'album' },
      ],
      order: [['title', 'ASC']],
      limit: limit ?? undefined,
    });
  }

  async findOne(id: string) {
    const { Song, Artist, Album } = this.db.models as any;
    const song = await Song.findOne({
      where: { id },
      include: [
        { model: Artist, as: 'artist' },
        { model: Album, as: 'album' },
      ],
    });
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }
}
