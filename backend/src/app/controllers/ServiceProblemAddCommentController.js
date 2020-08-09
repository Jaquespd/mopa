import ServiceProblem from '../models/ServiceProblem';

class ServiceProblemAddCommentController {
  async update(req, res) {
    // check if problem exists

    const { comments } = req.body;
    const { id } = req.params;

    const serviceProblem = await ServiceProblem.findByPk(id);

    if (!serviceProblem) {
      return res.status(400).json({ error: 'ServiceProblem does not exists' });
    }

    await serviceProblem.update({ comments });

    return res.json(serviceProblem);
  }
}

export default new ServiceProblemAddCommentController();
