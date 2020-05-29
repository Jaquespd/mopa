import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { Loading, UnForm, Button, Card } from './styles';
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

  useEffect(() => {
    async function loadData() {
      try {
        const [serviceResponse, employeeResponse] = await Promise.all([
          api.get('services', { params: { limit: 300 } }),
          api.get('employees', { params: { limit: 300 } }),
        ]);

        setServices(serviceResponse.data.items);
        setEmployees(employeeResponse.data.items);

        if (id) {
          const { data } = await api.get(`customerservices/${id}`);
          setCustomerService(data);

          const { services, employees, car } = data;

          if (services) {
            const defaultServices = services.map((service) => ({
              label: service.customer,
              value: service.id,
            }));

            formRef.current.setFieldValue('services_id', defaultServices);
          }

          if (employees) {
            const defaultEmployees = employees.map((employee) => ({
              label: employee.name,
              value: employee.id,
            }));

            formRef.current.setFieldValue('employees_id', defaultEmployees);
          }

          if (car) {
            const defaultCar = {
              label: car,
              value: car,
            };

            formRef.current.setFieldValue('car', defaultCar);
          }
        }
      } catch (err) {
        toast.error('Falha ao carregar dados');
      }
    }

    loadData();
  }, [id]);

  const servicesOptions = useMemo(() => {
    return services.map((service) => ({
      value: service.id,
      label: service.customer,
    }));
  }, [services]);

  const employeesOptions = useMemo(() => {
    return employees.map((employee) => ({
      value: employee.id,
      label: employee.name,
    }));
  }, [employees]);

  const carOptions = [
    {
      label: 'Sem carro',
      value: '',
    },
    {
      label: 'Doblo 8328',
      value: 'Doblo 8328',
    },
    {
      label: 'Doblo 8578',
      value: 'Doblo 8578',
    },
    {
      label: 'Oroch 7059',
      value: 'Oroch 7059',
    },
    {
      label: 'Oroch 7479',
      value: 'Oroch 7479',
    },
    {
      label: 'Toro 1774',
      value: 'Toro 1774',
    },
  ];

  function handleGoBack() {
    history.push('/customerservices');
  }

  async function handleSubmit(data) {
    console.log(data);
    if (id) {
      try {
        await api.put(`customerservices/${id}`, data);
        toast.success('O atendimento ao cliente foi atualizado com sucesso!');
        history.push('/customerservices');
      } catch (err) {
        toast.error(
          'Não foi possível atualizar o atendimento ao cliente. Verifique seus dados.'
        );
      }
    } else {
      try {
        const newState = {
          state: 'distribuido',
          ids: data.services_id,
        };
        await api.post('customerservices', data);
        toast.success('O atendimento ao cliente foi cadastrado com sucesso!');
        await api.put('service/state', newState);
        history.push('/customerservices');
      } catch (err) {
        toast.error(
          'Não foi possível realizar o cadastro. Verifique seus dados.'
        );
      }
    }
  }

  if (id && !customerService) {
    return (
      <Loading>
        <AiOutlineLoading />
      </Loading>
    );
  }
  return (
    <UnForm ref={formRef} onSubmit={handleSubmit}>
      <header>
        <PageTitle>
          {id ? 'Editar atendimento' : 'Cadastrar atendimento'}
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
        <AsyncSelect
          name="employees_id"
          label="Funcionário"
          placeholder="Selecione um funcionário"
          cacheOptions
          defaultOptions={employeesOptions}
          loadOptions={employeesOptions}
          isMulti
        />

        <AsyncSelect
          name="services_id"
          label="Serviço"
          placeholder="Selecione um serviço"
          cacheOptions
          defaultOptions={servicesOptions}
          loadOptions={servicesOptions}
          isMulti
        />

        <AsyncSelect
          name="car"
          label="Carro"
          placeholder="Selecione um carro"
          cacheOptions
          defaultOptions={carOptions}
          loadOptions={carOptions}
        />
      </Card>
    </UnForm>
  );
}

NewCustomerService.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
};
