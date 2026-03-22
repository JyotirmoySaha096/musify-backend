import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistsService {
  constructor(private db: DatabaseService) {}

  async findAll(limit?: number) {
    const { Artist } = this.db.models as any;
    return Artist.findAll({
      order: [['name', 'ASC']],
      limit: limit ?? undefined,
    });
  }

  async findOne(id: string) {
    const { Artist, Album, Song } = this.db.models as any;

    const artist = await Artist.findOne({
      where: { id },
      include: [
        {
          model: Album,
          as: 'albums',
          include: [{ model: Song, as: 'songs' }],
        },
        { model: Song, as: 'songs' },
      ],
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }
}
