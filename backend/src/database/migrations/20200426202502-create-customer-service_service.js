module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cs_services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_service_id: {
        type: Sequelize.INTEGER,
        references: { model: 'customer_services', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      services_id: {
        type: Sequelize.INTEGER,
        references: { model: 'services', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('cs_services');
  },
};
