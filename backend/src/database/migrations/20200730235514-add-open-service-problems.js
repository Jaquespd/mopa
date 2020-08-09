module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'service_problems',
      'open',
      Sequelize.BOOLEAN
    );
  },
  // futuramente tem de adicionar o defaultValue (defaultValue: true,)
  down: queryInterface => {
    return queryInterface.removeColumn('service_problems', 'open');
  },
};
