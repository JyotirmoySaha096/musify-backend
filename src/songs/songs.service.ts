import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../entities';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async findAll(limit?: number) {
    const query = this.songsRepository
      .createQueryBuilder('song')
      .leftJoinAndSelect('song.artist', 'artist')
      .leftJoinAndSelect('song.album', 'album')
      .orderBy('song.title', 'ASC');

    if (limit) {
      query.take(limit);
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }

  async streamFile(filePath: string, req: Request, res: Response) {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Audio file not found');
    }

    const stat = fs.statSync(absolutePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(absolutePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      });
      fs.createReadStream(absolutePath).pipe(res);
    }
  }
}
