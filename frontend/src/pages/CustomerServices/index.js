import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdAdd, MdRemoveRedEye, MdEdit, MdDeleteForever } from 'react-icons/md';

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
            <th>Carro</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {customerServices.map(
            ({ employees, services, status, ...customerService }) => (
              <tr key={String(customerService.id)}>
                <td>{customerService.idText}</td>
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
                          <li key={service.id}>{service.customer}</li>
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
                <td>{customerService?.car}</td>
                <td>
                  <CustomerServiceStatus color={status.color}>
                    {status.text}
                  </CustomerServiceStatus>
                </td>
                <td>
                  <Actions>
                    <button
                      type="button"
                      onClick={() =>
                        handleLook({ ...customerService, services })
                      }
                    >
                      <MdRemoveRedEye size={24} color="#8E5BE8" />
                      Visualizar
                    </button>
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
          closeCallback={() => setLooking(null)}
        />
      )}
    </Container>
  );
}
