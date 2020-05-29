import Problem from '../models/Problem';
import Delivery from '../models/Delivery';
import CustomerService from '../models/CustomerService';
import Employee from '../models/Employee';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Service from '../models/Service';
import ServiceProblem from '../models/ServiceProblem';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ServiceProblemController {
  async index(req, res) {
    const { page = 1, limit = 5 } = req.query;

    const total = await ServiceProblem.count();

    const problems = await ServiceProblem.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          association: 'service',
        },
        {
          association: 'employee',
        },
        {
          association: 'customerservice',
          include: [
            {
              association: 'services',
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
    const { service_id, employee_id, customer_service_id } = req.params;
    const service = await Service.findByPk(service_id);

    if (!service) {
      return res.status(400).json({ error: 'Service doest not exists' });
    }

    const employee = await Employee.findByPk(employee_id);

    if (!employee) {
      return res.status(400).json({ error: 'Employee doest not exists' });
    }

    const customerService = await CustomerService.findByPk(customer_service_id);

    if (!customerService) {
      return res
        .status(400)
        .json({ error: 'Customer Service doest not exists' });
    }

    const { id, description } = await ServiceProblem.create({
      service_id,
      employee_id,
      customer_service_id,
      ...req.body,
    });

    return res.json({ id, description });
  }

  async show(req, res) {
    const { service_id } = req.params;
    const problems = await ServiceProblem.findAll({
      attributes: ['id', 'description'],
      where: { service_id },
      include: [
        {
          model: Service,
          as: 'service',
        },
      ],
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const { id } = req.params;
    const problem = await ServiceProblem.findByPk(id);

    if (!problem)
      return res.status(400).json({ error: "Service's problem not found" });

    const customerService = await CustomerService.findByPk(
      problem.customer_service_id
    );

    if (!customerService) {
      return res.status(500).json({
        error:
          'The customer service that reference this problem has been not found',
      });
    }

    await customerService.addService([Number(problem.service_id)], {
      through: { canceled_at: new Date() },
    });

    // const { canceled_at } = await service.update({
    //   canceled_at: new Date(),
    // });

    // service.canceled_at = canceled_at;

    // await Queue.add(CancellationMail.key, {
    //   delivery,
    //   problem,
    // });

    return res.json();
  }
}

export default new ServiceProblemController();
