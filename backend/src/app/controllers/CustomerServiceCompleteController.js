import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import CustomerService from '../models/CustomerService';
import File from '../models/File';

class CustomerServiceCompleteController {
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const customerService = await CustomerService.findOne({
      where: {
        id: req.params.customerservice_id,
      },
      include: [
        {
          association: 'employees',
          where: { id: req.params.employee_id },
        },
        {
          association: 'services',
          where: { id: req.params.service_id },
        },
      ],
    });

    if (!customerService) {
      return res
        .status(400)
        .json({ error: "There's no customerService with this id" });
    }

    if (!customerService.services[0].CustomerServiceService.start_date) {
      return res
        .status(400)
        .json({ error: 'This customerService must been taken out before.' });
    }

    const { signature_id } = req.body;
    const signature = await File.findByPk(signature_id);

    if (!signature) {
      return res
        .status(400)
        .json({ error: "There's no signature with this id" });
    }

    await customerService.addService([Number(req.params.service_id)], {
      through: { signature_id, end_date: new Date() },
    });
    // const {
    //   id,
    //   services,
    //   employees,
    //   car,
    //   start_date,
    //   end_date,
    // } = await customerService.update({ signature_id, end_date: new Date() });

    return res.json(customerService);
  }
}

export default new CustomerServiceCompleteController();
