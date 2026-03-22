import { DataTypes, Sequelize } from 'sequelize';

export function initArtistModel(sequelize: Sequelize) {
  const Artist = sequelize.define(
    'Artist',
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
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'bio',
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'imageUrl',
      },
    },
    {
      tableName: 'artists',
      timestamps: false,
      underscored: false,
    },
  );

  return Artist;
}

