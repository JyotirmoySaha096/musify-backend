import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../entities';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
  ) {}

  async findAll(limit?: number) {
    const query = this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.artist', 'artist')
      .orderBy('album.title', 'ASC');

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const album = await this.albumsRepository.findOne({
      where: { id },
      relations: ['artist', 'songs', 'songs.artist'],
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    // Sort songs by track number
    if (album.songs) {
      album.songs.sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
    }
    return album;
  }
}
