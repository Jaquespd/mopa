import * as Yup from 'yup';
import { Op } from 'sequelize';
import Employee from '../models/Employee';
import ServiceProblem from '../models/ServiceProblem';
import Service from '../models/Service';
import CustomerService from '../models/CustomerService';

class ServiceController {
  async index(req, res) {
    const { q, page = 1, limit = 5 } = req.query;
    const where = {};

    if (q) {
      where.number = { [Op.iLike]: `%${q}%` };
    }

    const total = await Service.count({ where });
    const services = await Service.findAll({
      where,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: CustomerService,
          as: 'customer_services',
          attributes: ['id', 'car', 'start_date', 'end_date', 'canceled_at'],
        },
        {
          model: ServiceProblem,
          as: 'problems',
        },
      ],
    });

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: services,
    });
  }

  async store(req, res) {
    // Posteriormente adicionar email e phone para aviso do dia do agendamento e contato
    const schema = Yup.object().shape({
      customer: Yup.string().required(),
      city: Yup.string().required(),
      local: Yup.string().required(),
      type: Yup.string(),
      subtype: Yup.string(),
      description: Yup.string(),
      number: Yup.string(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const {
      id,
      customer,
      city,
      local,
      state,
      type,
      subtype,
      description,
      number,
    } = await Service.create({ ...req.body, state: 'aberto' });

    return res.json({
      id,
      customer,
      city,
      state,
      local,
      type,
      subtype,
      description,
      number,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) return res.status(400).json({});

    return res.json(service);
  }

  async update(req, res) {
    const serviceId = req.params.id;

    const schema = Yup.object().shape({
      customer: Yup.string().required(),
      city: Yup.string().required(),
      local: Yup.string().required(),
      type: Yup.string(),
      subtype: Yup.string(),
      description: Yup.string(),
      number: Yup.string(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    const service = await Service.findByPk(serviceId);
    if (!service) return res.status(400).json({ error: 'Service not found' });

    const {
      id,
      customer,
      city,
      local,
      type,
      subtype,
      description,
      number,
    } = await service.update(req.body);

    return res.json({
      id,
      customer,
      city,
      local,
      type,
      subtype,
      description,
      number,
    });
  }

  async delete(req, res) {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(400).json({ error: 'Service not exists' });
    }

    await service.destroy();

    return res.status(200).json({});
  }
}

export default new ServiceController();
