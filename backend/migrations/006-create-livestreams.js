'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('livestreams', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      stream_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      stream_key: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      channels: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'live', 'ended'),
        defaultValue: 'scheduled',
        allowNull: false
      },
      scheduled_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      viewers: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      engagement_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
        allowNull: false
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
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Tạo indexes
    await queryInterface.addIndex('livestreams', ['account_id'], {
      name: 'idx_account'
    });
    
    await queryInterface.addIndex('livestreams', ['status'], {
      name: 'idx_status'
    });
    
    await queryInterface.addIndex('livestreams', ['scheduled_time'], {
      name: 'idx_scheduled'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('livestreams');
  }
};