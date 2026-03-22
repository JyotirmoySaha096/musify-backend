import { DataTypes, Sequelize } from 'sequelize';

export function initPlaylistSongModel(sequelize: Sequelize) {
  const PlaylistSong = sequelize.define(
    'PlaylistSong',
    {
      playlistId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'playlist_id',
      },
      songId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'song_id',
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'position',
      },
      addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'addedAt',
      },
    },
    {
      tableName: 'playlist_songs',
      timestamps: false,
      underscored: false,
    },
  );

  return PlaylistSong;
}

