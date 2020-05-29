import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';

import { Container, Scroll } from './styles';

export default function LookProblem({ problem, closeCallback }) {
  useEffect(() => {
    document.addEventListener('keyup', closeCallback, false);
    return () => {
      document.removeEventListener('keyup', closeCallback, false);
    };
  }, [closeCallback]);

  if (!problem) return <></>;

  const {
    car,
    start_date,
    end_date,
    canceled_at,
    service,
  } = problem.customerservice;

  let formattedStart;
  let formattedCanceled;

  if (start_date) formattedStart = format(parseISO(start_date), 'dd/MM/yyyy');

  if (canceled_at)
    formattedCanceled = format(parseISO(canceled_at), 'dd/MM/yyyy');

  function handleCloseByClick(e) {
    if (e.target.id === 'look-delivery-container') closeCallback();
  }

  return (
    <Container id="look-delivery-container" onClick={handleCloseByClick}>
      <div>
        <Scroll>
          <strong>Informações do serviço</strong>
          <p>{car}</p>
          <p>{`${'service.city'}, ${'service.local'}`}</p>
          <p>{`${'service.subtype'} - ${'service.description'}`}</p>
          {'service.type' && <p>'service.type'</p>}

          {(start_date || end_date || canceled_at) && (
            <>
              <hr />
              <strong>Datas</strong>
            </>
          )}

          {start_date && (
            <p>
              <span>Retirada:</span> {formattedStart}
            </p>
          )}

          {canceled_at && (
            <p>
              <span>Cancelada:</span> {formattedCanceled}
            </p>
          )}

          <hr />
          <strong>Problema</strong>
          <p>{problem.description}</p>
        </Scroll>
      </div>
    </Container>
  );
}

LookProblem.propTypes = {
  problem: PropTypes.object.isRequired,
  closeCallback: PropTypes.func.isRequired,
};
