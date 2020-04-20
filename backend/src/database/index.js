import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import Delivery from '../app/models/Delivery';
import Problem from '../app/models/Problem';
import Employee from '../app/models/Employee';
import Service from '../app/models/Service';
import CustomerService from '../app/models/CustomerService';

import databaseConfig from '../config/database';

const models = [
  User,
  Recipient,
  File,
  Deliveryman,
  Delivery,
  Problem,
  Employee,
  Service,
  CustomerService,
];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
