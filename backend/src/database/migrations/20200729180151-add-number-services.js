module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('services', 'number', Sequelize.STRING);
  },

  down: queryInterface => {
    return queryInterface.removeColumn('services', 'number');
  },
};
