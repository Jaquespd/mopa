import * as Yup from 'yup';
import { Op } from 'sequelize';

import Deliveryman from '../models/Deliveryman';
import Employee from '../models/Employee';
import File from '../models/File';

class EmployeeController {
  async index(req, res) {
    const { q, page = 1, limit = 5 } = req.query;
    const where = {};

    if (q) {
      where.name = { [Op.iLike]: `%${q}%` };
    }

    const total = await Employee.count({ where });

    const employees = await Employee.findAll({
      where,
      attributes: ['id', 'name', 'role', 'phone', 'email'],
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      limit,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total,
      items: employees,
    });
  }

  async show(req, res) {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      attributes: {
        exclude: ['avatar_id'],
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (!employee) {
      return res.status(400).json({ error: 'Employee not found' });
    }

    return res.json(employee);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      role: Yup.string().required(),
      phone: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const EmployeeExists = await Employee.findOne({
      where: { email: req.body.email },
    });

    if (EmployeeExists) {
      return res
        .status(400)
        .json({ error: 'A employee with this email already exists' });
    }

    const { id, name, role, phone, email } = await Employee.create(req.body);

    return res.json({ id, name, role, phone, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      role: Yup.string(),
      phone: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(400).json({ error: 'Employee not exists' });
    }

    const { id, name, role, phone, email } = await employee.update(req.body);

    return res.json({ id, name, role, phone, email });
  }

  async delete(req, res) {
    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(400).json({ error: 'Employee not exists' });
    }

    await employee.destroy();

    return res.status(200).json({});
  }
}

export default new EmployeeController();
