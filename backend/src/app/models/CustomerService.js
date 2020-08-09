import Sequelize, { Model } from 'sequelize';

class CustomerService extends Model {
  static init(sequelize) {
    super.init(
      {
        car: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
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
      },
      {
        sequelize,
        tableName: 'customer_services',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Service, {
      through: models.CustomerServiceService,
      foreignKey: 'customer_service_id',
      as: 'services',
    });
    this.belongsToMany(models.Employee, {
      through: 'cs_employees',
      foreignKey: 'customer_service_id',
      as: 'employees',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    this.hasMany(models.ServiceProblem, {
      foreignKey: 'customer_service_id',
      as: 'problems',
    });
  }
}

export default CustomerService;
