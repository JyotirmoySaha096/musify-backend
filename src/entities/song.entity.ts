import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Album } from './album.entity';
import { Artist } from './artist.entity';
import { PlaylistSong } from './playlist-song.entity';
import { LikedSong } from './liked-song.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'duration_seconds' })
  durationSeconds: number;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({ name: 'track_number', nullable: true })
  trackNumber: number;

  @ManyToOne(() => Album, (album) => album.songs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @Column({ name: 'album_id' })
  albumId: string;

  @ManyToOne(() => Artist, (artist) => artist.songs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @Column({ name: 'artist_id' })
  artistId: string;

  @OneToMany(() => PlaylistSong, (ps) => ps.song)
  playlistSongs: PlaylistSong[];

  @OneToMany(() => LikedSong, (ls) => ls.song)
  likedSongs: LikedSong[];
}
