import CustomerService from '../models/CustomerService';

class CustomerServiceAddServiceController {
  async update(req, res) {
    const { id, service_id } = req.params;
    // check if customerService exists
    const customerService = await CustomerService.findByPk(id);

    if (!customerService) {
      return res.status(400).json({ error: 'CustomerService does not exists' });
    }

    await customerService.addServices(service_id);

    return res.json(customerService);
  }

  async delete(req, res) {
    const { id, service_id } = req.params;
    // check if customerService exists
    const customerService = await CustomerService.findByPk(id);

    if (!customerService) {
      return res.status(400).json({ error: 'CustomerService does not exists' });
    }

    await customerService.removeServices(service_id);

    return res.json(customerService);
  }
}

export default new CustomerServiceAddServiceController();
