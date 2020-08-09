import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import RecipientController from './app/controllers/RecipientController';
import ServiceController from './app/controllers/ServiceController';
import ServiceStateController from './app/controllers/ServiceStateController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import EmployeeController from './app/controllers/EmployeeController';
import DeliveryController from './app/controllers/DeliveryController';
import CustomerServiceController from './app/controllers/CustomerServiceController';
import CustomerServiceAddServiceController from './app/controllers/CustomerServiceAddServiceController';
import CustomerServiceActiveController from './app/controllers/CustomerServiceActiveController';
import TakeOutController from './app/controllers/TakeOutController';
import TakeOutCustomerServiceController from './app/controllers/TakeOutCustomerServiceController';
import CustomerServiceCompleteController from './app/controllers/CustomerServiceCompleteController';
import CompleteController from './app/controllers/CompleteController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';
import CustomerServiceStatusController from './app/controllers/CustomerServiceStatusController';
import ProblemController from './app/controllers/ProblemController';
import ServiceProblemController from './app/controllers/ServiceProblemController';
import ServiceProblemAddCommentController from './app/controllers/ServiceProblemAddCommentController';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliverymen/:id', DeliverymanController.show);

routes.get('/deliveryman/:id/deliveries', DeliveryStatusController.index);

routes.get(
  '/employee/:id/customerservices',
  CustomerServiceStatusController.index
);

routes.put(
  '/deliveryman/:deliveryman_id/delivery/:id',
  TakeOutController.update
);

routes.put(
  '/employee/:employee_id/customerservice/:id/service/:service_id',
  TakeOutCustomerServiceController.update
);

routes.put(
  '/deliveryman/:deliveryman_id/deliveries/:delivery_id',
  CompleteController.update
);

routes.put(
  '/employee/:employee_id/customerservices/:customerservice_id/service/:service_id',
  CustomerServiceCompleteController.update
);

routes.put('/service/state', ServiceStateController.update);

routes.post('/delivery/:delivery_id/problems', ProblemController.store);
routes.get('/delivery/:delivery_id/problems', ProblemController.show);

routes.post(
  '/customerservice/:customer_service_id/employee/:employee_id/service/:service_id/problems',
  ServiceProblemController.store
);
routes.get('/service/:service_id/problems', ServiceProblemController.show);

routes.post('/files', upload.single('file'), FileController.store);
routes.get('/files/:id', FileController.show);

routes.get('/employees/:id', EmployeeController.show);
routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients/:id', RecipientController.show);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.get('/delivery/:id', DeliveryController.show);
routes.delete('/delivery/:id', DeliveryController.delete);

routes.get('/problems', ProblemController.index);
routes.delete('/problem/:id/cancel-delivery', ProblemController.delete);

routes.get('/service-problems', ServiceProblemController.index);
routes.delete(
  '/customer-service/:customer_service_id/cancel-service/service/:service_id',
  ServiceProblemController.delete
);

routes.get('/employees', EmployeeController.index);
routes.post('/employees', EmployeeController.store);
routes.put('/employees/:id', EmployeeController.update);
routes.delete('/employees/:id', EmployeeController.delete);

routes.get('/services', ServiceController.index);
routes.post('/services', ServiceController.store);
routes.put('/services/:id', ServiceController.update);
routes.get('/services/:id', ServiceController.show);
routes.delete('/services/:id', ServiceController.delete);

routes.get('/customerservices', CustomerServiceController.index);
routes.post('/customerservices', CustomerServiceController.store);
routes.put('/customerservices/:id', CustomerServiceController.update);
routes.get('/customerservices/:id', CustomerServiceController.show);
routes.delete('/customerservices/:id', CustomerServiceController.delete);

routes.put(
  '/customerservices/:id/active',
  CustomerServiceActiveController.update
);

routes.put(
  '/customerservices/:id/add/service/:service_id',
  CustomerServiceAddServiceController.update
);

routes.delete(
  '/customerservices/:id/remove/service/:service_id',
  CustomerServiceAddServiceController.delete
);

routes.put('/service-problem/:id/open', ServiceProblemController.update);
routes.put(
  '/service-problem/:id/add-comment',
  ServiceProblemAddCommentController.update
);

export default routes;
