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
      item.idText =
        item.customer_service.id > 9
          ? `#${item.customer_service.id}`
          : `#0${item.customer_service.id}`;

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

    await api.delete(`/problem/${item.id}/cancel-customerservice`);
    toast.info(`O atendimento ${item.idText} foi cancelado.`);

    console.tron.log(gonnaCancel);
  }, []);

  async function handlePagination(n) {
    const params = {
      page: n,
    };

    const response = await api.get('problemscustomerservice', { params });
    const data = parseProblems(response.data.items);
    setProblems(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  useEffect(() => {
    async function getEmployees() {
      const response = await api.get('problemscustomerservice');
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
                {item.customer_service.canceled_at && (
                  <DeliveryStatus color={deliveryStatus.canceled}>
                    cancelada
                  </DeliveryStatus>
                )}
              </td>
              <td>
                <DescriptionField>{item.description}</DescriptionField>
              </td>
              <td>
                <Actions w={!item.customer_service.canceled_at ? 220 : 125}>
                  <button type="button" onClick={() => handleLook(item)}>
                    <MdRemoveRedEye size={24} color="#4D85EE" />
                    Visualizar
                  </button>
                  {!item.customer_service.canceled_at && (
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
