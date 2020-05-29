import { Model, Sequelize } from 'sequelize';

class Service extends Model {
  static init(sequelize) {
    super.init(
      {
        customer: Sequelize.STRING,
        city: Sequelize.STRING,
        local: Sequelize.STRING,
        type: Sequelize.STRING,
        subtype: Sequelize.STRING,
        state: Sequelize.STRING,
        description: Sequelize.STRING,
        closed_at: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: 'services',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.CustomerService, {
      through: models.CustomerServiceService,
      foreignKey: 'services_id',
      as: 'customer_services',
    });
    this.hasMany(models.ServiceProblem, {
      foreignKey: 'service_id',
      as: 'problems',
    });
  }
}

export default Service;
