import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  MdAdd,
  MdRemoveRedEye,
  MdEdit,
  MdDeleteForever,
  MdControlPoint,
  MdDoNotDisturb,
  MdReportProblem,
  MdSyncProblem,
} from 'react-icons/md';

import {
  Container,
  EmployeeField,
  Avatar,
  LetterAvatar,
  CustomerServiceStatus,
} from './styles';

import { PageTitle } from '~/styles/PageTittle';
import { customerServiceStatus } from '~/styles/colors';

import SearchInput from '~/components/SearchInput';
import Actions from '~/components/Actions';
import Table from '~/components/Table';
import Pagination from '~/components/Pagination';
import LookCustomerService from './LookCustomerService';

import api from '~/services/api';
import history from '~/services/history';

import { createLetterAvatar } from '~/util/letterAvatar';

export default function CustomerServices() {
  const [customerServices, setCustomerServices] = useState([]);
  const [looking, setLooking] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const parseCustomerServices = useCallback((data) => {
    return data.map((customerService, index) => {
      customerService.idText =
        customerService.id > 9
          ? `#${customerService.id}`
          : `#0${customerService.id}`;

      if (customerService.employee) {
        customerService.employee.letterAvatar = createLetterAvatar(
          customerService.employee.name,
          index
        );
      }

      customerService.services.map((service, index) => {
        if (service.problems.length > 0) {
          service.problems.map((problem) => {
            if (customerService.services[index].problemIcon !== 'openProblem') {
              if (problem.open === true) {
                customerService.services[index].problemIcon = 'openProblem';
              } else {
                customerService.services[index].problemIcon = 'closeProblem';
              }
            }
          });
          // customerService.services[index].problems
        } else {
          customerService.services[index].problemIcon = 'noProblem';
        }

        if (service.CustomerServiceService.canceled_at) {
          customerService.services[index].situacion = {
            color: customerServiceStatus.canceled,
            text: 'CANCELADO',
          };
        } else if (service.CustomerServiceService.end_date) {
          customerService.services[index].situacion = {
            color: customerServiceStatus.delivered,
            text: 'FINALIZADO',
          };
        } else if (service.CustomerServiceService.start_date) {
          customerService.services[index].situacion = {
            color: customerServiceStatus.takeout,
            text: 'INICIADO',
          };
        } else {
          customerService.services[index].situacion = {
            color: customerServiceStatus.pending,
            text: 'PENDENTE',
          };
        }
      });

      if (customerService.canceled_at)
        customerService.status = {
          color: customerServiceStatus.canceled,
          text: 'CANCELADA',
        };
      else if (customerService.end_date)
        customerService.status = {
          color: customerServiceStatus.delivered,
          text: 'ENTREGUE',
        };
      else if (customerService.start_date)
        customerService.status = {
          color: customerServiceStatus.takeout,
          text: 'RETIRADA',
        };
      else {
        customerService.status = {
          color: customerServiceStatus.pending,
          text: 'PENDENTE',
        };
      }
      return customerService;
    });
  }, []);

  const handleLook = useCallback((customerService) => {
    setLooking(customerService);
  }, []);

  const handleEdit = useCallback((customerService) => {
    history.push(`/customerservices/edit/${customerService.id}`);
  }, []);

  const handleDelete = useCallback(
    async (customerService) => {
      // eslint-disable-next-line no-alert
      const gonnaDelete = window.confirm(
        `Tem certeza que deseja excluir o atendimento ao cliente ${customerService.idText}?`
      );

      if (!gonnaDelete) return;

      await api.delete(`customerservices/${customerService.id}`);
      toast.info(
        `O atendimento ao cliente ${customerService.idText} foi excluído!`
      );
      setCustomerServices(
        customerServices.filter(({ id }) => id !== customerService.id)
      );
    },
    [customerServices]
  );

  async function handleSearch(search) {
    const response = await api.get(`customerservices?q=${search}`);
    const data = parseCustomerServices(response.data.items);
    setCustomerServices(data);
    setSearchText(search);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  async function handlePagination(n) {
    const params = {
      page: n,
      q: searchText,
    };

    const response = await api.get('customerservices', { params });
    const data = parseCustomerServices(response.data.items);
    setCustomerServices(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  useEffect(() => {
    async function getCustomerServices() {
      const response = await api.get('customerservices');
      const data = parseCustomerServices(response.data.items);
      setCustomerServices(data);
      setPage(response.data.page);
      setPages(response.data.pages);
      setTotal(response.data.total);
    }

    getCustomerServices();
  }, [parseCustomerServices]);

  async function getCustomerServices(page = 1) {
    const response = await api.get(`customerservices?page=${page}`);
    const data = parseCustomerServices(response.data.items);
    setCustomerServices(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  async function handleToggleActive(id) {
    const response = await api.put(`customerservices/${id}/active`);

    const data = customerServices.map((customerService) => {
      customerService.active =
        customerService.id === id
          ? !customerService.active
          : customerService.active;
      return customerService;
    });

    setCustomerServices(data);
  }
  return (
    <Container>
      <header>
        <PageTitle>Gerenciando atendimentos aos clientes</PageTitle>
      </header>
      <div>
        <SearchInput placeholder="Buscar por carros" callback={handleSearch} />
        <Link to="/customerservices/new">
          <MdAdd color="#FFFFFF" size={26} />
          Cadastrar
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Funcionários</th>
            <th>Serviços</th>
            <th>Cidades</th>
            <th>Status</th>
            <th>Carro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {customerServices.map(
            ({ employees, services, status, ...customerService }) => (
              <tr key={String(customerService.id)}>
                <td>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(customerService.id)}
                    >
                      {customerService.active ? (
                        <MdControlPoint size={24} color="#00FF7F" />
                      ) : (
                        <MdDoNotDisturb size={24} color="#DE3B3B" />
                      )}
                    </button>
                    {customerService.idText}
                  </div>
                </td>
                <td>
                  <ul>
                    {employees
                      ? employees.map((employee) => (
                          <li key={employee.id}>{employee.name}</li>
                        ))
                      : ''}
                  </ul>
                </td>
                <td>
                  <ul>
                    {services
                      ? services.map((service) => (
                          <li key={service.id}>
                            <div>
                              {service.number}{' '}
                              <button
                                type="button"
                                onClick={() =>
                                  handleLook({ ...customerService, service })
                                }
                              >
                                {service.problemIcon === 'openProblem' && (
                                  <MdReportProblem size={24} color="#DE3B3B" />
                                )}
                                {service.problemIcon === 'closeProblem' && (
                                  <MdSyncProblem size={24} color="#00FF7F" />
                                )}
                                <MdRemoveRedEye size={24} color="#8E5BE8" />
                              </button>
                            </div>
                          </li>
                        ))
                      : ''}
                  </ul>
                </td>
                <td>
                  <ul>
                    {services
                      ? services.map((service) => (
                          <li key={service.id}>{service.city}</li>
                        ))
                      : ''}
                  </ul>
                </td>
                <td>
                  {services
                    ? services.map((service) => (
                        <ul key={service.id}>
                          <li>
                            <CustomerServiceStatus
                              key={service.id}
                              color={service.situacion.color}
                            >
                              {service.situacion.text}
                            </CustomerServiceStatus>
                          </li>
                        </ul>
                      ))
                    : ''}
                </td>
                <td>{customerService?.car}</td>
                <td>
                  <Actions>
                    <button
                      type="button"
                      onClick={() => handleEdit(customerService)}
                    >
                      <MdEdit size={24} color="#4D85EE" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(customerService)}
                    >
                      <MdDeleteForever size={24} color="#DE3B3B" />
                      Excluir
                    </button>
                  </Actions>
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      <Pagination
        total={total}
        page={page}
        pages={pages}
        callback={handlePagination}
      />
      {looking && (
        <LookCustomerService
          delivery={looking}
          updateCustomerServices={() => getCustomerServices(page)}
          closeCallback={() => setLooking(null)}
        />
      )}
    </Container>
  );
}
