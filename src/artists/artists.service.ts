import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../entities';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async findAll(limit?: number) {
    const query = this.artistsRepository
      .createQueryBuilder('artist')
      .orderBy('artist.name', 'ASC');

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const artist = await this.artistsRepository.findOne({
      where: { id },
      relations: ['albums', 'albums.songs', 'songs'],
    });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }
}
