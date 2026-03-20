import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';

@Entity('liked_songs')
export class LikedSong {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'song_id' })
  songId: string;

  @CreateDateColumn()
  likedAt: Date;

  @ManyToOne(() => User, (user) => user.likedSongs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Song, (song) => song.likedSongs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song: Song;
}
