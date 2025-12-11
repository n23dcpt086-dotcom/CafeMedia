const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    channel: {
      type: DataTypes.ENUM('Facebook', 'YouTube', 'TikTok', 'Instagram', 'Website'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Chuẩn bị', 'Đang chạy', 'Hoàn thành'),
      defaultValue: 'Chuẩn bị'
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    participants: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    achievement: {
      type: DataTypes.STRING(100),
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'campaigns',
    timestamps: false,
    indexes: [
      { fields: ['account_id'] },
      { fields: ['start_date', 'end_date'] },
      { fields: ['status'] }
    ]
  });

  return Campaign;
};