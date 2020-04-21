import Sequelize, { Model } from 'sequelize';

class ProblemCustomerService extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      { sequelize, tableName: 'customer_service_problems' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.CustomerService, {
      foreignKey: 'customer_service_id',
      as: 'customer_service',
    });
  }
}

export default ProblemCustomerService;
