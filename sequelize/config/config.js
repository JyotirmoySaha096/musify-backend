const dotenv = require('dotenv');

// Load environment variables from `.env` if present.
dotenv.config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'spotify',
    password: process.env.DB_PASSWORD || 'spotify_secret',
    database: process.env.DB_NAME || 'spotify_clone',
    logging: false,
  },
  test: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'spotify',
    password: process.env.DB_PASSWORD || 'spotify_secret',
    database: process.env.DB_NAME || 'spotify_clone',
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'spotify',
    password: process.env.DB_PASSWORD || 'spotify_secret',
    database: process.env.DB_NAME || 'spotify_clone',
    logging: false,
  },
};

