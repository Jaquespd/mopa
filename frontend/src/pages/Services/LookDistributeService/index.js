import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';
import { toast } from 'react-toastify';

import { Container, Scroll } from './styles';
import api from '~/services/api';

export default function LookDistributeService({
  delivery,
  serviceId,
  closeCallback,
  updateServices,
}) {
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    document.addEventListener('keyup', closeCallback, false);
    return () => {
      document.removeEventListener('keyup', closeCallback, false);
    };
  }, [closeCallback]);

  useEffect(() => {
    handleSearch();
  }, []);

  if (!delivery) return <></>;
  if (!serviceId) return <></>;

  const {
    car,
    start_date,
    end_date,
    canceled_at,
    services,
    problems,
    signature,
  } = delivery;

  async function handleSearch() {
    const response = await api.get(`customerservices?q=activeCustomerService`);
    console.log('response', response.data.items);

    const equipes = response.data.items;

    setTeams(equipes);
  }

  async function handleAddService(customerServiceId) {
    try {
      await api.put(
        `customerservices/${customerServiceId}/add/service/${serviceId}`
      );

      const newState = {
        state: 'distribuido',
        ids: serviceId,
      };
      await api.put('service/state', newState);

      toast.success('Serviço distribuido com sucesso.');
      updateServices();
      closeCallback();
    } catch (err) {
      toast.error('Não foi possível distribuir este serviço');
    }
  }

  function handleCloseByClick(e) {
    if (e.target.id === 'look-delivery-container') closeCallback();
  }

  return (
    <Container id="look-delivery-container" onClick={handleCloseByClick}>
      <div>
        <label>Distribuição de Serviço</label>
        <Scroll>
          {teams &&
            teams.map((team) => {
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => handleAddService(team.id)}
                >
                  <p>
                    <span>ID Equipe: {team.id}</span>
                    {team.employees.length > 0 ? (
                      team.employees.map((employee) => (
                        <span key={employee.id}>{employee.name}</span>
                      ))
                    ) : (
                      <span>Sem funcionários</span>
                    )}
                    {team.services.length > 0 ? (
                      <span>Nº Serviços: {team.services.length}</span>
                    ) : (
                      <span>Nº Serviços: 0</span>
                    )}
                    {team.car ? (
                      <span>Carro: {team.car}</span>
                    ) : (
                      <span>Sem Carro</span>
                    )}
                  </p>
                </button>
              );
            })}
        </Scroll>
      </div>
    </Container>
  );
}

LookDistributeService.propTypes = {
  delivery: PropTypes.object.isRequired,
  closeCallback: PropTypes.func.isRequired,
};
