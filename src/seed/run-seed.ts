import { Sequelize } from 'sequelize';
import { seed } from './seed';
import { initModels } from '../models';

async function run() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'spotify_clone',
    process.env.DB_USER || 'spotify',
    process.env.DB_PASSWORD || 'spotify_secret',
    {
      // `sequelize-cli` + runtime uses `dialect: 'postgres'` for Postgres.
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      dialect: 'postgres',
      logging: false,
      define: {
        underscored: false,
      },
    },
  );

  const models = initModels(sequelize);
  await sequelize.authenticate();
  console.log('Connected to database');

  await seed(models as any);

  await sequelize.close();
  console.log('Seed complete!');
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
