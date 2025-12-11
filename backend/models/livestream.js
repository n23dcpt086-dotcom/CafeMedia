const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Livestream = sequelize.define('Livestream', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stream_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    stream_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    channels: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'live', 'ended'),
      defaultValue: 'scheduled'
    },
    scheduled_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    viewers: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    engagement_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
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
    tableName: 'livestreams',
    timestamps: false,
    indexes: [
      { fields: ['account_id'] },
      { fields: ['status'] },
      { fields: ['scheduled_time'] }
    ]
  });

  return Livestream;
};