// models/Post.js
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
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft'
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: true
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
      { fields: ['status'] }
    ]
  });

  return Post;
};