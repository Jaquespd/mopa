import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  MdAdd,
  MdEdit,
  MdDeleteForever,
  MdControlPoint,
  MdReportProblem,
  MdSyncProblem,
  MdRemoveRedEye,
} from 'react-icons/md';

import { Container, NameField, LetterAvatar, ServiceStatus } from './styles';
import { itemStatus } from '~/styles/colors';

import { PageTitle } from '~/styles/PageTittle';

import SearchInput from '~/components/SearchInput';
import Actions from '~/components/Actions';
import Table from '~/components/Table';
import Pagination from '~/components/Pagination';
import LookDistributeService from './LookDistributeService';
import LookService from './LookService';

import api from '~/services/api';
import history from '~/services/history';

import { createLetterAvatar } from '~/util/letterAvatar';

export default function Services() {
  const [services, setServices] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [looking, setLooking] = useState(null);
  const [lookingId, setLookingId] = useState(null);
  const [lookingService, setLookingService] = useState(null);
  const [lookingServiceId, setLookingServiceId] = useState(null);

  const parseServices = useCallback((data) => {
    return data.map((item, index) => {
      item.idText = item.id > 9 ? `#${item.id}` : `#0${item.id}`;

      item.letterAvatar = createLetterAvatar(item.customer, index);

      item.summary = `${item.city}, ${item.local}${
        item.type ? ` [${item.type}]` : ``
      }, ${item.subtype ? ` [${item.subtype}]` : ``} - ${
        item.description ? ` [${item.description}]` : ``
      }`;

      if (item.problems.length > 0) {
        //

        item.problems.map((problem) => {
          if (data[index].problemIcon !== 'openProblem') {
            if (problem.open === true) {
              data[index].problemIcon = 'openProblem';
            } else {
              data[index].problemIcon = 'closeProblem';
            }
          }
        });
      } else {
        data[index].problemIcon = 'noProblem';
      }

      if (item.customer_services) {
        if (item.customer_services.length > 0) {
          item.status = {
            color: '',
            text: '',
          };
          item.customer_services.map((customerService) => {
            if (item.status) {
              if (item.status.text !== 'FECHADO') {
                if (customerService.CustomerServiceService.end_date) {
                  item.status = {
                    color: itemStatus.canceled,
                    text: 'FECHADO',
                  };
                }
              }

              if (
                item.status.text !== 'FECHADO' &&
                item.status.text !== 'DISTRIBUIDO'
              ) {
                if (customerService.CustomerServiceService.canceled_at) {
                  item.status = {
                    color: itemStatus.pending,
                    text: 'ABERTO',
                  };
                }
              }

              if (
                item.status.text !== 'FECHADO' &&
                item.status.text !== 'ABERTO'
              ) {
                item.status = {
                  color: itemStatus.delivered,
                  text: 'DISTRIBUIDO',
                };
              }
            }
          });
        } else {
          item.status = {
            color: itemStatus.pending,
            text: 'ABERTO',
          };
        }
      }

      // if (item.state === 'fechado')
      //   item.status = {
      //     color: itemStatus.canceled,
      //     text: 'FECHADO',
      //   };
      // else if (item.state === 'distribuido')
      //   item.status = {
      //     color: itemStatus.delivered,
      //     text: 'DISTRIBUIDO',
      //   };
      // else {
      //   item.status = {
      //     color: itemStatus.pending,
      //     text: 'ABERTO',
      //   };
      // }

      return item;
    });
  }, []);

  const handleSearch = async (search) => {
    const response = await api.get(`services?q=${search}`);
    const data = parseServices(response.data.items);
    setServices(data);
    setSearchText(search);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  };

  const handleEdit = useCallback((item) => {
    history.push(`/services/edit/${item.id}`);
  }, []);

  const handleLook = useCallback((customerService, serviceId) => {
    setLooking(customerService);
    setLookingId(serviceId);
  }, []);

  const handleLookService = useCallback((services, serviceId) => {
    console.log('services', services);
    console.log('serviceId', serviceId);
    const [service] = services.filter((service) => service.id === serviceId);
    setLookingService(service);
    setLookingServiceId(serviceId);
  }, []);

  const handleDelete = useCallback(
    async (item) => {
      // eslint-disable-next-line no-alert
      const gonnaDelete = window.confirm(
        `Tem certeza que deseja excluir o serviço ${item.idText}?`
      );

      if (!gonnaDelete) return;

      await api.delete(`services/${item.id}`);
      toast.info(`O serviço ${item.idText} foi excluído!`);
      setServices(services.filter(({ id }) => id !== item.id));
    },
    [services]
  );

  async function handlePagination(n) {
    const params = {
      page: n,
      q: searchText,
    };

    const response = await api.get('services', { params });
    const data = parseServices(response.data.items);
    setServices(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  useEffect(() => {
    async function getServices() {
      const response = await api.get('services');
      const data = parseServices(response.data.items);
      setServices(data);
      setPage(response.data.page);
      setPages(response.data.pages);
      setTotal(response.data.total);
    }

    getServices();
  }, [parseServices]);

  async function getServices(page = 1) {
    const response = await api.get(`services?page=${page}`);
    const data = parseServices(response.data.items);
    setServices(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  return (
    <Container>
      <header>
        <PageTitle>Gerenciando serviços</PageTitle>
      </header>
      <div>
        <SearchInput placeholder="Buscar por chamado" callback={handleSearch} />
        <Link to="/services/new">
          <MdAdd color="#FFFFFF" size={26} />
          Cadastrar
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Chamado</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Subtipo</th>
            <th>Cidade</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map((item) => (
            <tr key={String(item.id)}>
              <td>{item.idText}</td>
              <td>
                {item.number}
                <button
                  type="button"
                  onClick={() => handleLookService(services, item.id)}
                >
                  {item.problemIcon === 'openProblem' && (
                    <MdReportProblem size={24} color="#DE3B3B" />
                  )}
                  {item.problemIcon === 'closeProblem' && (
                    <MdSyncProblem size={24} color="#00FF7F" />
                  )}
                  <MdRemoveRedEye size={24} color="#8E5BE8" />
                </button>
              </td>

              <NameField>{item.customer}</NameField>
              <td>{item.type}</td>
              <td>{item.subtype}</td>
              <td>{item.city}</td>
              <td>
                <ServiceStatus color={item.status.color}>
                  {item.status.text} - ({item.customer_services.length})
                </ServiceStatus>
              </td>
              <td>
                <Actions>
                  <button
                    type="button"
                    onClick={() => handleLook({ services }, item.id)}
                  >
                    <MdControlPoint size={24} color="#00FF7F" />
                    Distribuir
                  </button>
                  <button type="button" onClick={() => handleEdit(item)}>
                    <MdEdit size={24} color="#4D85EE" />
                    Editar
                  </button>
                  <button type="button" onClick={() => handleDelete(item)}>
                    <MdDeleteForever size={24} color="#DE3B3B" />
                    Excluir
                  </button>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        total={total}
        page={page}
        pages={pages}
        callback={handlePagination}
      />
      {looking && (
        <LookDistributeService
          delivery={looking}
          serviceId={lookingId}
          updateServices={() => getServices(page)}
          closeCallback={() => setLooking(null)}
        />
      )}
      {lookingService && (
        <LookService
          delivery={lookingService}
          serviceId={lookingServiceId}
          updateServices={() => getServices(page)}
          closeCallback={() => setLookingService(null)}
        />
      )}
    </Container>
  );
}
