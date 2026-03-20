import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Song, Album, Artist } from '../entities';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Song) private songsRepo: Repository<Song>,
    @InjectRepository(Album) private albumsRepo: Repository<Album>,
    @InjectRepository(Artist) private artistsRepo: Repository<Artist>,
  ) {}

  async search(query: string) {
    if (!query.trim()) {
      return { songs: [], albums: [], artists: [] };
    }

    const pattern = `%${query}%`;

    const [songs, albums, artists] = await Promise.all([
      this.songsRepo.find({
        where: { title: ILike(pattern) },
        relations: ['artist', 'album'],
        take: 10,
      }),
      this.albumsRepo.find({
        where: { title: ILike(pattern) },
        relations: ['artist'],
        take: 10,
      }),
      this.artistsRepo.find({
        where: { name: ILike(pattern) },
        take: 10,
      }),
    ]);

    return { songs, albums, artists };
  }
}
