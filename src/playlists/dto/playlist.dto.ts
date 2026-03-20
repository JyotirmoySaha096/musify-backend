import { IsString, IsOptional } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;
}

export class AddSongToPlaylistDto {
  @IsString()
  songId: string;
}
