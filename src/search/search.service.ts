import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class SearchService {
  constructor(private db: DatabaseService) {}

  async search(query: string) {
    if (!query.trim()) {
      return { songs: [], albums: [], artists: [] };
    }

    const pattern = `%${query}%`;
    const { Song, Album, Artist } = this.db.models as any;

    const [songs, albums, artists] = await Promise.all([
      Song.findAll({
        where: { title: { [Op.iLike]: pattern } },
        include: [
          { model: Artist, as: 'artist' },
          { model: Album, as: 'album' },
        ],
        limit: 10,
      }),
      Album.findAll({
        where: { title: { [Op.iLike]: pattern } },
        include: [{ model: Artist, as: 'artist' }],
        limit: 10,
      }),
      Artist.findAll({
        where: { name: { [Op.iLike]: pattern } },
        limit: 10,
      }),
    ]);

    return { songs, albums, artists };
  }
}
