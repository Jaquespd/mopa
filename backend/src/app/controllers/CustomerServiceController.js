import * as Yup from 'yup';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Problem from '../models/Problem';
import File from '../models/File';
import NewDeliveryMail from '../jobs/NewDeliveryMail';
import Queue from '../../lib/Queue';
import CustomerService from '../models/CustomerService';
import Service from '../models/Service';
import Employee from '../models/Employee';

class CustomerServiceController {
  async index(req, res) {
    const { q, page = 1, limit = 5 } = req.query;
    const where = {};

    if (q) {
      where.car = { [Op.iLike]: `%${q}%` };
    }

    const total = await CustomerService.count({ where });
    const customerServices = await CustomerService.findAll({
      where,
      attributes: ['id', 'car', 'canceled_at', 'start_date', 'end_date'],
      order: [['id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: Service,
          as: 'services',
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
          as: 'employees',
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
        // {
        //   model: Problem,
        //   as: 'problems',
        //   attributes: ['id', 'description', 'createdAt'],
        // },
      ],
    });

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: customerServices,
    });
  }

  async show(req, res) {
    const customerService = await CustomerService.findByPk(req.params.id, {
      attributes: ['id', 'car', 'canceled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Service,
          as: 'services',
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
          as: 'employees',
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
        // {
        //   model: Problem,
        //   as: 'problems',
        //   attributes: ['id', 'description', 'createdAt'],
        // },
      ],
    });

    if (!customerService) {
      return res.status(400).json({ error: 'CustomerService not found' });
    }

    return res.json(customerService);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      services_id: Yup.array(),
      employees_id: Yup.array(),
      car: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { services_id, employees_id, car } = req.body;

    const customerService = await CustomerService.create({
      car,
    });

    if (services_id) {
      await customerService.addService(services_id);
    }

    if (employees_id) {
      await customerService.addEmployee(employees_id);
    }

    // AJUSTAR O EMAIL DE NOTIFICAÇÃO
    // await Queue.add(NewDeliveryMail.key, {
    //   employee,
    //   car,
    //   service,
    // });

    return res.json(customerService);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      service_id: Yup.array(),
      employee_id: Yup.array(),
      car: Yup.string(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    // check if customerService exists
    const customerService = await CustomerService.findByPk(req.params.id);

    if (!customerService) {
      return res.status(400).json({ error: 'CustomerService does not exists' });
    }

    const { services_id, employees_id, car } = req.body;

    await customerService.update({ car });

    await customerService.setServices(services_id);

    await customerService.setEmployees(employees_id);

    return res.json(customerService);
  }

  async delete(req, res) {
    const customerService = await CustomerService.findByPk(req.params.id);

    if (!customerService) {
      return res
        .status(400)
        .json({ error: 'Can not find this customerService' });
    }

    await customerService.destroy();

    return res.status(200).json();
  }
}

export default new CustomerServiceController();
