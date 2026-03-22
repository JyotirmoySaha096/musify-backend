import { DataTypes, Sequelize } from 'sequelize';

export function initUserModel(sequelize: Sequelize) {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'passwordHash',
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatarUrl',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'createdAt',
      },
    },
    {
      tableName: 'users',
      timestamps: false,
      underscored: false,
    },
  );

  return User;
}

