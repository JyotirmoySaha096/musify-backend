import { Sequelize } from 'sequelize';
import { initAlbumModel } from './album.model';
import { initArtistModel } from './artist.model';
import { initLikedSongModel } from './liked-song.model';
import { initPlaylistModel } from './playlist.model';
import { initPlaylistSongModel } from './playlist-song.model';
import { initSongModel } from './song.model';
import { initUserModel } from './user.model';

export function initModels(sequelize: Sequelize) {
  const User = initUserModel(sequelize);
  const Artist = initArtistModel(sequelize);
  const Album = initAlbumModel(sequelize);
  const Song = initSongModel(sequelize);
  const Playlist = initPlaylistModel(sequelize);
  const PlaylistSong = initPlaylistSongModel(sequelize);
  const LikedSong = initLikedSongModel(sequelize);

  // User -> Playlists
  User.hasMany(Playlist, { foreignKey: 'userId', as: 'playlists' });
  Playlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Playlist -> PlaylistSongs -> Song
  Playlist.hasMany(PlaylistSong, { foreignKey: 'playlistId', as: 'playlistSongs' });
  PlaylistSong.belongsTo(Playlist, { foreignKey: 'playlistId', as: 'playlist' });
  PlaylistSong.belongsTo(Song, { foreignKey: 'songId', as: 'song' });
  Song.hasMany(PlaylistSong, { foreignKey: 'songId', as: 'playlistSongs' });

  // User -> LikedSongs -> Song
  User.hasMany(LikedSong, { foreignKey: 'userId', as: 'likedSongs' });
  LikedSong.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  LikedSong.belongsTo(Song, { foreignKey: 'songId', as: 'song' });
  Song.hasMany(LikedSong, { foreignKey: 'songId', as: 'likedSongs' });

  // Artist -> Albums/Songs
  Artist.hasMany(Album, { foreignKey: 'artistId', as: 'albums' });
  Album.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

  Artist.hasMany(Song, { foreignKey: 'artistId', as: 'songs' });
  Song.belongsTo(Artist, { foreignKey: 'artistId', as: 'artist' });

  // Album -> Songs
  Album.hasMany(Song, { foreignKey: 'albumId', as: 'songs' });
  Song.belongsTo(Album, { foreignKey: 'albumId', as: 'album' });

  return {
    User,
    Artist,
    Album,
    Song,
    Playlist,
    PlaylistSong,
    LikedSong,
  };
}

