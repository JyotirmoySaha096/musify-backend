import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumsService {
  constructor(private db: DatabaseService) {}

  async findAll(limit?: number) {
    const { Album, Artist } = this.db.models as any;
    return Album.findAll({
      include: [{ model: Artist, as: 'artist' }],
      order: [['title', 'ASC']],
      limit: limit ?? undefined,
    });
  }

  async findOne(id: string) {
    const { Album, Artist, Song } = this.db.models as any;

    const album = await Album.findOne({
      where: { id },
      include: [
        { model: Artist, as: 'artist' },
        { model: Song, as: 'songs', include: [{ model: Artist, as: 'artist' }] },
      ],
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }
    // Sort songs by track number
    if ((album as any).songs) {
      (album as any).songs.sort(
        (a: any, b: any) => (a.trackNumber || 0) - (b.trackNumber || 0),
      );
    }
    return album;
  }
}
