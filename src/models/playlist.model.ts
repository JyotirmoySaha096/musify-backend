import { DataTypes, Sequelize } from 'sequelize';

export function initPlaylistModel(sequelize: Sequelize) {
  const Playlist = sequelize.define(
    'Playlist',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coverUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'coverUrl',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'createdAt',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
    },
    {
      tableName: 'playlists',
      timestamps: false,
      underscored: false,
    },
  );

  return Playlist;
}

