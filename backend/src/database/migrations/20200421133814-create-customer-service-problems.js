module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customer_service_problems', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'customer_services', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('customer_service_problems');
  },
};
