import { DataTypes, Sequelize } from 'sequelize';

export function initLikedSongModel(sequelize: Sequelize) {
  const LikedSong = sequelize.define(
    'LikedSong',
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'user_id',
      },
      songId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: 'song_id',
      },
      likedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'likedAt',
      },
    },
    {
      tableName: 'liked_songs',
      timestamps: false,
      underscored: false,
    },
  );

  return LikedSong;
}

