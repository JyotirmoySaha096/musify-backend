import { Injectable, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize';
import { initModels } from '../models';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public sequelize!: Sequelize;
  public models!: ReturnType<typeof initModels>;

  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '5432', 10);
    const username = process.env.DB_USER || 'spotify';
    const password = process.env.DB_PASSWORD || 'spotify_secret';
    const database = process.env.DB_NAME || 'spotify_clone';

    // Note: avoid `sync()`; schema should be managed by migrations.
    this.sequelize = new Sequelize(database, username, password, {
      dialect: 'postgres',
      host,
      port,
      logging: false,
      define: {
        underscored: false,
      },
    });

    this.models = initModels(this.sequelize);
  }

  async onModuleInit() {
    // Ensure the DB is reachable on app startup.
    await this.sequelize.authenticate();
  }
}

