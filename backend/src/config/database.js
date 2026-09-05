const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
};

// Function to get sequelize instance for a given environment
const getSequelize = (env) => {
  return new Sequelize(config[env]);
};

// For backward compatibility, we export the config and a function to get the sequelize instance
// and a connectDB function that uses the development environment
const sequelize = getSequelize(process.env.NODE_ENV || 'development');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL database connection established successfully.');

    // In development, sync models (alter: true) - remove in production and use migrations
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized (alter: true)');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = {
  ...config,
  sequelize,
  connectDB
};