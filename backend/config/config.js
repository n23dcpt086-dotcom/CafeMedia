module.exports = {
  development: {
    username: 'root',
    password: 'root12345678',
    database: 'CafeMedia',
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: 'root',
    password: 'root12345678',
    database: 'CafeMedia_test',
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};