import Sequelize, { Model } from 'sequelize';

class CustomerServiceService extends Model {
  static init(sequelize) {
    super.init(
      {
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
      },
      {
        sequelize,
        tableName: 'cs_services',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
    this.belongsTo(models.CustomerService, {
      foreignKey: 'customer_service_id',
      as: 'customer_service',
    });
    this.belongsTo(models.Service, {
      foreignKey: 'services_id',
      as: 'services',
    });
  }
}

export default CustomerServiceService;
