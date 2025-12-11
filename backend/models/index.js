const { Sequelize } = require('sequelize');
const config = require('../config/config');

// Khởi tạo Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    timezone: '+07:00',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const Account = require('./Account')(sequelize);
const Post = require('./Post')(sequelize);
const Comment = require('./Comment')(sequelize);
const Campaign = require('./Campaign')(sequelize);
const Schedule = require('./Schedule')(sequelize);
const Livestream = require('./Livestream')(sequelize);

// Định nghĩa các quan hệ (associations)
const models = {
  Account,
  Post,
  Comment,
  Campaign,
  Schedule,
  Livestream
};

// Account relationships
Account.hasMany(Post, { foreignKey: 'account_id', as: 'posts' });
Account.hasMany(Comment, { foreignKey: 'account_id', as: 'comments' });
Account.hasMany(Campaign, { foreignKey: 'account_id', as: 'campaigns' });
Account.hasMany(Schedule, { foreignKey: 'account_id', as: 'schedules' });
Account.hasMany(Livestream, { foreignKey: 'account_id', as: 'livestreams' });

// Post relationships
Post.belongsTo(Account, { foreignKey: 'account_id', as: 'author' });
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
Post.hasOne(Schedule, { foreignKey: 'post_id', as: 'schedule' });

// Comment relationships
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });
Comment.belongsTo(Account, { foreignKey: 'account_id', as: 'author' });

// Campaign relationships
Campaign.belongsTo(Account, { foreignKey: 'account_id', as: 'creator' });

// Schedule relationships
Schedule.belongsTo(Account, { foreignKey: 'account_id', as: 'creator' });
Schedule.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

// Livestream relationships
Livestream.belongsTo(Account, { foreignKey: 'account_id', as: 'creator' });

module.exports = {
  sequelize,
  ...models
};