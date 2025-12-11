'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
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
      body: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image: {
        type: Sequelize.BLOB('medium'),
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      video: {
        type: Sequelize.BLOB('medium'),
        allowNull: true
      },
      video_url: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('article', 'image', 'video'),
        defaultValue: 'article',
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
      status: {
        type: Sequelize.ENUM('draft', 'pending', 'published'),
        defaultValue: 'draft',
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      comments_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      engine: 'InnoDB'
    });

    // Tạo indexes
    await queryInterface.addIndex('posts', ['account_id'], {
      name: 'idx_account'
    });
    
    await queryInterface.addIndex('posts', ['status'], {
      name: 'idx_status'
    });
    
    await queryInterface.addIndex('posts', ['time'], {
      name: 'idx_time'
    });
    
    await queryInterface.addIndex('posts', ['type'], {
      name: 'idx_type'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};