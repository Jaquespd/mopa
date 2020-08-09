import Sequelize, { Model } from 'sequelize';

class ServiceProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        comments: Sequelize.STRING,
        open: Sequelize.BOOLEAN,
      },
      { sequelize, tableName: 'service_problems' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service',
    });
    this.belongsTo(models.CustomerService, {
      foreignKey: 'customer_service_id',
      as: 'customerservice',
    });
    this.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
  }
}

export default ServiceProblem;
