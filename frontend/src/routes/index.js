import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';
import Deliveries from '~/pages/Deliveries';
import CustomerServices from '~/pages/CustomerServices';
import NewDelivery from '~/pages/NewDelivery';
import NewCustomerService from '~/pages/NewCustomerService';
import Deliverymen from '~/pages/Deliverymen';
import NewDeliveryman from '~/pages/NewDeliveryman';
import Employees from '~/pages/Employees';
import NewEmployee from '~/pages/NewEmployee';
import Recipients from '~/pages/Recipients';
import NewRecipient from '~/pages/NewRecipient';
import Services from '~/pages/Services';
import NewService from '~/pages/NewService';
import Problems from '~/pages/Problems';
import ProblemsCustomerServices from '~/pages/ProblemsCustomerServices';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} locationName="" />
      <Route
        path="/deliveries/new"
        component={NewDelivery}
        isPrivate
        locationName="deliveries"
      />
      <Route
        path="/deliveries/edit/:id"
        component={NewDelivery}
        isPrivate
        locationName="deliveries"
      />
      <Route
        path="/deliveries"
        component={Deliveries}
        isPrivate
        locationName="deliveries"
      />
      <Route
        path="/customerservices/new"
        component={NewCustomerService}
        isPrivate
        locationName="customerservices"
      />
      <Route
        path="/customerservices/edit/:id"
        component={NewCustomerService}
        isPrivate
        locationName="customerservices"
      />
      <Route
        path="/customerservices"
        component={CustomerServices}
        isPrivate
        locationName="customerservices"
      />
      <Route
        path="/deliverymen/new"
        component={NewDeliveryman}
        isPrivate
        locationName="deliverymen"
      />
      <Route
        path="/deliverymen/edit/:id"
        component={NewDeliveryman}
        isPrivate
        locationName="deliverymen"
      />
      <Route
        path="/deliverymen"
        component={Deliverymen}
        isPrivate
        locationName="deliverymen"
      />
      <Route
        path="/employees/new"
        component={NewEmployee}
        isPrivate
        locationName="employees"
      />
      <Route
        path="/employees/edit/:id"
        component={NewEmployee}
        isPrivate
        locationName="employees"
      />
      <Route
        path="/employees"
        component={Employees}
        isPrivate
        locationName="employees"
      />
      <Route
        path="/recipients/new"
        component={NewRecipient}
        isPrivate
        locationName="recipients"
      />
      <Route
        path="/recipients/edit/:id"
        component={NewRecipient}
        isPrivate
        locationName="recipients"
      />
      <Route
        path="/recipients"
        component={Recipients}
        isPrivate
        locationName="recipients"
      />
      <Route
        path="/services/new"
        component={NewService}
        isPrivate
        locationName="services"
      />
      <Route
        path="/services/edit/:id"
        component={NewService}
        isPrivate
        locationName="services"
      />
      <Route
        path="/services"
        component={Services}
        isPrivate
        locationName="services"
      />
      <Route
        path="/problems"
        component={Problems}
        isPrivate
        locationName="problems"
      />
      <Route
        path="/problemscustomerservices"
        component={ProblemsCustomerServices}
        isPrivate
        locationName="problemscustomerservices"
      />
    </Switch>
  );
}
