import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Song } from './song.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ nullable: true })
  releaseYear: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @Column({ name: 'artist_id' })
  artistId: string;

  @OneToMany(() => Song, (song) => song.album)
  songs: Song[];
}
