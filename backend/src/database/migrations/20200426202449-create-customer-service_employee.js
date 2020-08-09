module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cs_employees', {
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
      employees_id: {
        type: Sequelize.INTEGER,
        references: { model: 'employees', key: 'id' },
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
    return queryInterface.dropTable('cs_employees');
  },
};
