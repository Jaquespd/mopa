import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { MdRemoveRedEye, MdDeleteForever } from 'react-icons/md';

import { Container, DescriptionField, DeliveryStatus } from './styles';

import { PageTitle } from '~/styles/PageTittle';
import { deliveryStatus } from '~/styles/colors';

import Actions from '~/components/Actions';
import Table from '~/components/Table';
import Pagination from '~/components/Pagination';

import LookProblem from './LookProblem';

import api from '~/services/api';

export default function ProblemsCustomerServices() {
  const [problems, setProblems] = useState([]);
  const [looking, setLooking] = useState(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const parseProblems = useCallback((data) => {
    return data.map((item) => {
      item.idText = item.id > 9 ? `#${item.id}` : `#0${item.id}`;

      return item;
    });
  }, []);

  const handleLook = useCallback((item) => {
    setLooking(item);
  }, []);

  const handleCancelCustomerService = useCallback(async (item) => {
    // eslint-disable-next-line no-alert
    const gonnaCancel = window.confirm(
      `Tem certeza que deseja cancelar o atendimento ao cliente ${item.idText}?`
    );

    if (!gonnaCancel) return;

    await api.delete(`/service-problem/${item.id}/cancel-service`);
    toast.info(`O atendimento ${item.idText} foi cancelado.`);

    await api.put('service/state', {
      state: 'aberto',
      ids: item.service.id,
    });

    console.log(gonnaCancel);
  }, []);

  async function handlePagination(n) {
    const params = {
      page: n,
    };

    const response = await api.get('service-problems', { params });
    const data = parseProblems(response.data.items);
    setProblems(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  useEffect(() => {
    async function getEmployees() {
      const response = await api.get('service-problems');
      const data = parseProblems(response.data.items);
      setProblems(data);
      setPage(response.data.page);
      setPages(response.data.pages);
      setTotal(response.data.total);
    }

    getEmployees();
  }, [parseProblems]);

  return (
    <Container>
      <header>
        <PageTitle>Problemas no atendimento</PageTitle>
      </header>
      <Table>
        <thead>
          <tr>
            <th>Atendimento</th>
            <th>Problema</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((item) => (
            <tr key={String(item.id)}>
              <td>
                {item.idText}{' '}
                {item.customerservice.services.filter(
                  (service) => service.id === item.service.id
                )[0].CustomerServiceService.canceled_at && (
                  <DeliveryStatus color={deliveryStatus.canceled}>
                    cancelada
                  </DeliveryStatus>
                )}
              </td>
              <td>
                <DescriptionField>{item.description}</DescriptionField>
              </td>
              <td>
                <Actions
                  w={
                    !item.customerservice.services.filter(
                      (service) => service.id === item.service.id
                    )[0].CustomerServiceService.canceled_at
                      ? 220
                      : 125
                  }
                >
                  <button type="button" onClick={() => handleLook(item)}>
                    <MdRemoveRedEye size={24} color="#4D85EE" />
                    Visualizar
                  </button>
                  {!item.customerservice.services.filter(
                    (service) => service.id === item.service.id
                  )[0].CustomerServiceService.canceled_at && (
                    <button
                      type="button"
                      onClick={() => handleCancelCustomerService(item)}
                    >
                      <MdDeleteForever size={24} color="#DE3B3B" />
                      Cancelar atendimento
                    </button>
                  )}
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
        <LookProblem problem={looking} closeCallback={() => setLooking(null)} />
      )}
    </Container>
  );
}
