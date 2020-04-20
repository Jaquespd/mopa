import Sequelize, { Model } from 'sequelize';

class CustomerService extends Model {
  static init(sequelize) {
    super.init(
      {
        product: {
          type: Sequelize.STRING,
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
    this.belongsTo(models.Service, {
      foreignKey: 'service_id',
      as: 'service',
    });
    this.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    // this.hasMany(models.Problem, { foreignKey: 'delivery_id', as: 'problems' });
  }
}

export default CustomerService;
