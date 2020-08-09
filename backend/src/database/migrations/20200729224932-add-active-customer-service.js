module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'customer_services',
      'active',
      Sequelize.BOOLEAN
    );
  },
  // futuramente tem de adicionar o defaultValue (defaultValue: true,)
  down: queryInterface => {
    return queryInterface.removeColumn('customer_services', 'active');
  },
};
