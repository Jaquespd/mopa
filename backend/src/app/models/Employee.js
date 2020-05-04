import Sequelize, { Model } from 'sequelize';

class Employee extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        role: Sequelize.STRING,
        phone: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'employees',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
    this.belongsToMany(models.CustomerService, {
      through: 'cs_employees',
      foreignKey: 'employees_id',
      as: 'customer_services',
    });
  }
}

export default Employee;
