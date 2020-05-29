import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import CustomerService from '../models/CustomerService';
import { checkIndividualDate } from '../helpers/CheckDate';

class TakeOutCustomerServiceController {
  async update(req, res) {
    const { employee_id, id, service_id } = req.params;

    const customerService = await CustomerService.findOne({
      where: {
        id,
        canceled_at: null,
        signature_id: null,
      },
      include: [
        {
          association: 'services',
        },
        {
          association: 'employees',
          where: { id: employee_id },
        },
      ],
    });

    if (!customerService) {
      return res
        .status(400)
        .json({ error: "There's no customerService with this id" });
    }

    const start_date = new Date();

    const checkDate = checkIndividualDate(start_date);
    if (checkDate.error) {
      return res.status(400).json(checkDate);
    }

    // const takenOutCustomerServices = await CustomerService.count({
    //   where: {
    //     employee_id,
    //     start_date: {
    //       [Op.between]: [startOfDay(start_date), endOfDay(start_date)],
    //     },
    //   },
    // });

    // if (takenOutCustomerServices >= 5) {
    //   return res
    //     .status(401)
    //     .json({ error: 'You can take just 5 customerServices per day' });
    // }

    // const { car, services, end_date } = await customerService.update({
    //   start_date,
    // });

    const test = await customerService.addServices(Number(service_id), {
      through: { start_date },
    });

    const test2 = await customerService.getServices();

    return res.json(test2);
  }
}

export default new TakeOutCustomerServiceController();
