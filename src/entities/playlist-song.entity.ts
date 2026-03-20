import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Song } from './song.entity';

@Entity('playlist_songs')
export class PlaylistSong {
  @PrimaryColumn({ name: 'playlist_id' })
  playlistId: string;

  @PrimaryColumn({ name: 'song_id' })
  songId: string;

  @Column({ default: 0 })
  position: number;

  @CreateDateColumn()
  addedAt: Date;

  @ManyToOne(() => Playlist, (playlist) => playlist.playlistSongs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @ManyToOne(() => Song, (song) => song.playlistSongs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'song_id' })
  song: Song;
}
