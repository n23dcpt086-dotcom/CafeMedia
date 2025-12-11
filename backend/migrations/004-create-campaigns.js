'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('campaigns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      channel: {
        type: Sequelize.ENUM('Facebook', 'YouTube', 'TikTok', 'Instagram', 'Website'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Chuẩn bị', 'Đang chạy', 'Hoàn thành'),
        defaultValue: 'Chuẩn bị',
        allowNull: false
      },
      goal: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      participants: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      achievement: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Tạo indexes
    await queryInterface.addIndex('campaigns', ['account_id'], {
      name: 'idx_account'
    });
    
    await queryInterface.addIndex('campaigns', ['start_date', 'end_date'], {
      name: 'idx_dates'
    });
    
    await queryInterface.addIndex('campaigns', ['status'], {
      name: 'idx_status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('campaigns');
  }
};