import { DataTypes, Sequelize } from 'sequelize';

export function initSongModel(sequelize: Sequelize) {
  const Song = sequelize.define(
    'Song',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      durationSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'duration_seconds',
      },
      audioUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'audio_url',
      },
      trackNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'track_number',
      },
      albumId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'album_id',
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'artist_id',
      },
    },
    {
      tableName: 'songs',
      timestamps: false,
      underscored: false,
    },
  );

  return Song;
}

