const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    publish_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    channel: {
      type: DataTypes.ENUM('fb', 'yt', 'tt', 'web'),
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'posts',
        key: 'id'
      },
      onDelete: 'SET NULL'
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'schedules',
    timestamps: false,
    indexes: [
      { fields: ['publish_time'] },
      { fields: ['account_id'] },
      { fields: ['channel'] }
    ]
  });

  return Schedule;
};