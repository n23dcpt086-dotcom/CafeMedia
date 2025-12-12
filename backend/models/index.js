// models/index.js

const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    timezone: '+07:00'
  }
);

// Import tất cả models
const Account = require('./account')(sequelize);
const Post = require('./post')(sequelize);
const Comment = require('./comment')(sequelize);
const Schedule = require('./schedule')(sequelize);

Post.belongsTo(Account, {
  foreignKey: 'account_id',
  as: 'author'
});

Account.hasMany(Post, {
  foreignKey: 'account_id',
  as: 'posts'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post'
});

Comment.belongsTo(Account, {
  foreignKey: 'account_id',
  as: 'author'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  as: 'comments'
});

Account.hasMany(Comment, {
  foreignKey: 'account_id',
  as: 'comments'
});

Schedule.belongsTo(Account, {
  foreignKey: 'account_id',
  as: 'account'
});

Schedule.belongsTo(Post, {
  foreignKey: 'post_id',
  as: 'post'
});

Account.hasMany(Schedule, {
  foreignKey: 'account_id',
  as: 'schedules'
});

Post.hasMany(Schedule, {
  foreignKey: 'post_id',
  as: 'schedules'
});

const db = {
  sequelize,
  Sequelize,
  Account,
  Post,
  Comment,
  Schedule
};

module.exports = db;