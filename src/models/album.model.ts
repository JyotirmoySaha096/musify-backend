import { DataTypes, Sequelize } from 'sequelize';

export function initAlbumModel(sequelize: Sequelize) {
  const Album = sequelize.define(
    'Album',
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
      coverUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'coverUrl',
      },
      releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'releaseYear',
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'artist_id',
      },
    },
    {
      tableName: 'albums',
      timestamps: false,
      underscored: false,
    },
  );

  return Album;
}

