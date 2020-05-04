import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { Loading, Form, Button, Card } from './styles';
import { PageTitle } from '~/styles/PageTittle';

import Input from '~/components/Input';
import Select from '~/components/Select';

import history from '~/services/history';
import api from '~/services/api';

import AsyncSelect from '~/components/AsyncSelectInput';

export default function NewCustomerService({ match }) {
  const formRef = useRef(null);
  const { id } = match.params;

  const [customerService, setCustomerService] = useState(null);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [serviceResponse, employeeResponse] = await Promise.all([
          api.get('services', { params: { limit: 300 } }),
          api.get('employees', { params: { limit: 300 } }),
        ]);
        console.log('loadData');
        setServices(serviceResponse.data.items);
        setEmployees(employeeResponse.data.items);

        if (id) {
          const { data } = await api.get(`customerservices/${id}`);
          setCustomerService(data);
          setSelectedService(data.service);
          setSelectedEmployee(data.employee);
        }
      } catch (err) {
        toast.error('Falha ao carregar dados');
      }
    }

    loadData();
  }, [id]);

  const servicesOptions = useMemo(() => {
    return services.map((service) => ({
      value: service,
      label: service.customer,
    }));
  }, [services]);

  const employeesOptions = useMemo(() => {
    return employees.map((employee) => ({
      value: employee,
      label: employee.name,
    }));
  }, [employees]);

  const handleChangeService = (selectedOption) => {
    const { value } = selectedOption;

    setSelectedService(value);
  };

  const handleChangeEmployee = async (selectedOption) => {
    console.log('selectedOption', selectedOption);
    // const { value } = selectedOption;
    // setSelectedEmployee(value);
    console.log('1');

    // setSelectedEmployee(selectedOption.map((option) => option.value));

    // setSelectedEmployee(selectedOption);

    console.log('SelectedEmployee', selectedEmployee);
  };

  function handleGoBack() {
    history.push('/customerservices');
  }

  async function handleSubmit(data) {
    console.log('data', formRef.current);
    // if (!selectedService || !selectedEmployee || !data.car) {
    //   toast.error('Preencha todo o formulário');
    //   return;
    // }

    // data.service_id = selectedService.id;
    // data.employee_id = selectedEmployee.id;

    // if (id) {
    //   try {
    //     await api.put(`customerservices/${id}`, data);
    //     toast.success('O atendimento ao cliente foi atualizado com sucesso!');
    //     history.push('/customerservices');
    //   } catch (err) {
    //     toast.error(
    //       'Não foi possível atualizar o atendimento ao cliente. Verifique seus dados.'
    //     );
    //   }
    // } else {
    //   try {
    //     await api.post('customerservices', data);
    //     toast.success('O atendimento ao cliente foi cadastrado com sucesso!');
    //     history.push('/customerservices');
    //   } catch (err) {
    //     toast.error(
    //       'Não foi possível realizar o cadastro. Verifique seus dados.'
    //     );
    //   }
    // }
  }

  if (id && !customerService) {
    return (
      <Loading>
        <AiOutlineLoading />
      </Loading>
    );
  }
  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      initialData={customerService || undefined}
    >
      <header>
        <PageTitle>
          {customerService ? 'Editar atendimento' : 'Cadastrar atendimento'}
        </PageTitle>
        <Button type="button" onClick={handleGoBack}>
          <MdKeyboardArrowLeft size={24} />
          Voltar
        </Button>
        <Button color="#4D85EE" type="submit">
          <MdDone size={24} />
          Salvar
        </Button>
      </header>
      <Card>
        <Select
          name="employee.name"
          label="Funcionário"
          placeholder="Selecione um funcionário"
          options={employeesOptions}
          defaultValue={
            customerService
              ? {
                  value: customerService.employee.id,
                  label: customerService.employee.name,
                }
              : undefined
          }
          onChange={handleChangeEmployee}
        />

        <Select
          name="service.customer"
          label="Serviço"
          placeholder="Selecione um serviço"
          options={servicesOptions}
          defaultValue={
            customerService
              ? {
                  value: customerService.service.id,
                  label: customerService.service.customer,
                }
              : undefined
          }
          onChange={handleChangeService}
        />

        <Input name="car" title="Carro" placeholder="Ex: Oroch" />
      </Card>
    </Form>
  );
}

NewCustomerService.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
};
