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
      signature_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
