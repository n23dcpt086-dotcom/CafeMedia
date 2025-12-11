const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.BLOB('medium'),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    video: {
      type: DataTypes.BLOB('medium'),
      allowNull: true
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('article', 'image', 'video'),
      defaultValue: 'article'
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'published'),
      defaultValue: 'draft'
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    comments_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'posts',
    timestamps: false,
    indexes: [
      { fields: ['account_id'] },
      { fields: ['status'] },
      { fields: ['time'] },
      { fields: ['type'] }
    ]
  });

  return Post;
};