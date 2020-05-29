import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdAdd, MdEdit, MdDeleteForever } from 'react-icons/md';

import { Container, NameField, LetterAvatar, ServiceStatus } from './styles';
import { itemStatus } from '~/styles/colors';

import { PageTitle } from '~/styles/PageTittle';

import SearchInput from '~/components/SearchInput';
import Actions from '~/components/Actions';
import Table from '~/components/Table';
import Pagination from '~/components/Pagination';

import api from '~/services/api';
import history from '~/services/history';

import { createLetterAvatar } from '~/util/letterAvatar';

export default function Services() {
  const [services, setServices] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const parseServices = useCallback((data) => {
    return data.map((item, index) => {
      item.idText = item.id > 9 ? `#${item.id}` : `#0${item.id}`;

      item.letterAvatar = createLetterAvatar(item.customer, index);

      item.summary = `${item.city}, ${item.local}${
        item.type ? ` [${item.type}]` : ``
      }, ${item.subtype ? ` [${item.subtype}]` : ``} - ${
        item.description ? ` [${item.description}]` : ``
      }`;

      if (item.state === 'fechado')
        item.status = {
          color: itemStatus.canceled,
          text: 'FECHADO',
        };
      else if (item.state === 'distribuido')
        item.status = {
          color: itemStatus.delivered,
          text: 'DISTRIBUIDO',
        };
      else {
        item.status = {
          color: itemStatus.pending,
          text: 'ABERTO',
        };
      }

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

  return (
    <Container>
      <header>
        <PageTitle>Gerenciando serviços</PageTitle>
      </header>
      <div>
        <SearchInput
          placeholder="Buscar por serviços"
          callback={handleSearch}
        />
        <Link to="/services/new">
          <MdAdd color="#FFFFFF" size={26} />
          Cadastrar
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
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

              <NameField>{item.customer}</NameField>
              <td>{item.type}</td>
              <td>{item.subtype}</td>
              <td>{item.city}</td>
              <td>
                <ServiceStatus color={item.status.color}>
                  {item.status.text}
                </ServiceStatus>
              </td>
              <td>
                <Actions>
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
    </Container>
  );
}
