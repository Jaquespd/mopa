import * as Yup from 'yup';
import Service from '../models/Service';

class ServiceStateController {
  async update(req, res) {
    // const serviceId = req.params.id;

    const schema = Yup.object().shape({
      state: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation fails' });

    // const service = await Service.findByPk(serviceId);

    // if (!service) return res.status(400).json({ error: 'Service not found' });

    const { state, ids } = req.body;

    const {
      id,
      customer,
      city,
      local,
      type,
      subtype,
      description,
    } = await Service.update(
      { state },
      {
        where: {
          id: ids,
        },
      }
    );

    return res.json({
      id,
      customer,
      city,
      local,
      state,
      type,
      subtype,
      description,
    });
  }
}

export default new ServiceStateController();
