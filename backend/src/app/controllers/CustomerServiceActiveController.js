import CustomerService from '../models/CustomerService';

class CustomerServiceActiveController {
  async update(req, res) {
    // check if customerService exists
    const customerService = await CustomerService.findByPk(req.params.id);

    if (!customerService) {
      return res.status(400).json({ error: 'CustomerService does not exists' });
    }

    const active = !customerService.active;

    await customerService.update({ active });

    return res.json(customerService);
  }
}

export default new CustomerServiceActiveController();
