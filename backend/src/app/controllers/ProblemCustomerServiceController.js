import Problem from '../models/Problem';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import ProblemCustomerService from '../models/ProblemCustomerService';
import CustomerService from '../models/CustomerService';
import Employee from '../models/Employee';
import Service from '../models/Service';
import File from '../models/File';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ProblemCustomerServiceController {
  async index(req, res) {
    const { page = 1, limit = 5 } = req.query;

    const total = await ProblemCustomerService.count();

    const problems = await ProblemCustomerService.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: CustomerService,
          as: 'customer_service',
          attributes: ['id', 'car', 'start_date', 'end_date', 'canceled_at'],
          include: [
            {
              model: Service,
              as: 'service',
              attributes: [
                'id',
                'customer',
                'city',
                'local',
                'type',
                'subtype',
                'description',
              ],
            },
            {
              model: Employee,
              as: 'employee',
              attributes: ['id', 'name', 'role', 'phone', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: problems,
    });
  }

  async store(req, res) {
    const { customerService_id } = req.params;
    const customerService = await CustomerService.findByPk(customerService_id);

    if (!customerService) {
      return res
        .status(400)
        .json({ error: 'CustomerService doest not exists' });
    }

    const { id, description } = await ProblemCustomerService.create({
      customer_service_id: customerService_id,
      ...req.body,
    });

    return res.json({ id, description });
  }

  async show(req, res) {
    const { customerService_id } = req.params;
    const problems = await ProblemCustomerService.findAll({
      attributes: ['id', 'description'],
      where: { customer_service_id: customerService_id },
      include: [
        {
          model: CustomerService,
          as: 'customer_service',
          attributes: ['id', 'car', 'start_date', 'end_date'],
          include: [
            {
              model: Service,
              as: 'service',
              attributes: [
                'id',
                'customer',
                'city',
                'local',
                'type',
                'subtype',
                'description',
              ],
            },
            {
              model: Employee,
              as: 'employee',
              attributes: ['id', 'name', 'role', 'phone', 'email'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
            {
              model: File,
              as: 'signature',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const { id } = req.params;
    const problem = await ProblemCustomerService.findByPk(id);

    if (!problem)
      return res
        .status(400)
        .json({ error: 'Customer service problem not found' });

    const customerService = await CustomerService.findByPk(
      problem.customer_service_id,
      {
        include: [
          { model: Employee, as: 'employee' },
          { model: Service, as: 'service' },
        ],
      }
    );

    if (!customerService) {
      return res.status(500).json({
        error:
          'The customer service that reference this problem has been not found',
      });
    }

    const { canceled_at } = await customerService.update({
      canceled_at: new Date(),
    });

    customerService.canceled_at = canceled_at;

    await Queue.add(CancellationMail.key, {
      customerService,
      problem,
    });

    return res.json();
  }
}

export default new ProblemCustomerServiceController();
