import { Op } from 'sequelize';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';
import Problem from '../models/Problem';
import Service from '../models/Service';
import Employee from '../models/Employee';
import CustomerService from '../models/CustomerService';

class CustomerServiceStatusController {
  async index(req, res) {
    const completed = req.query.completed || false;
    const { page = 1 } = req.query;

    const test = await CustomerService.findAll({
      limit: 6,
      offset: (page - 1) * 6,
      order: ['createdAt'],
      attributes: ['id', 'car', 'start_date', 'end_date', 'createdAt'],
      include: [
        {
          association: 'services',
          through: {
            where: {
              canceled_at: null,
              signature_id: completed ? { [Op.ne]: null } : null,
            },
          },
        },
        {
          association: 'employees',
          where: {
            id: req.params.id,
          },
        },
      ],
    });

    const customerServiceIds = test.map(customerService => customerService.id);

    const test2 = await CustomerService.findAll({
      where: {
        id: customerServiceIds,
      },

      limit: 6,
      offset: (page - 1) * 6,
      order: ['createdAt'],
      include: [
        {
          association: 'services',
          include: [
            {
              association: 'problems',
            },
          ],
          through: {
            where: {
              canceled_at: null,
              signature_id: completed ? { [Op.ne]: null } : null,
            },
          },
        },
        {
          association: 'employees',
        },
      ],
    });

    return res.status(200).json(test2);
    // return res.status(200).json(customerServices);
  }
}

export default new CustomerServiceStatusController();
