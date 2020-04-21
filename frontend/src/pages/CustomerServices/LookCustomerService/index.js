import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';

import { Container, Scroll } from './styles';

export default function LookCustomerService({
  customerService,
  closeCallback,
}) {
  useEffect(() => {
    document.addEventListener('keyup', closeCallback, false);
    return () => {
      document.removeEventListener('keyup', closeCallback, false);
    };
  }, [closeCallback]);

  if (!customerService) return <></>;

  const {
    car,
    start_date,
    end_date,
    canceled_at,
    service,
    problems,
    signature,
  } = customerService;

  let formattedStart;
  let formattedEnd;
  let formattedCanceled;

  if (start_date) formattedStart = format(parseISO(start_date), 'dd/MM/yyyy');

  if (end_date) formattedEnd = format(parseISO(end_date), 'dd/MM/yyyy');

  if (canceled_at)
    formattedCanceled = format(parseISO(canceled_at), 'dd/MM/yyyy');

  function handleCloseByClick(e) {
    if (e.target.id === 'look-delivery-container') closeCallback();
  }

  return (
    <Container id="look-delivery-container" onClick={handleCloseByClick}>
      <div>
        <Scroll>
          <strong>Informações do atendimento</strong>
          <p>{car}</p>
          <p>{`${service?.city}, ${service?.local}`}</p>
          <p>{`${service?.subtype} - ${service?.description}`}</p>
          {service?.type && <p>service?.type</p>}

          {(start_date || end_date || canceled_at) && (
            <>
              <hr />
              <strong>Datas</strong>
            </>
          )}

          {formattedStart && (
            <p>
              <span>Retirada:</span> {formattedStart}
            </p>
          )}

          {formattedEnd && (
            <p>
              <span>Entrega:</span> {formattedEnd}
            </p>
          )}

          {formattedCanceled && (
            <p>
              <span>Cancelada:</span> {formattedCanceled}
            </p>
          )}

          {problems.length > 0 && (
            <>
              <hr />
              <strong>Problemas ocorridos</strong>
              {problems.map((problem, i) => (
                <div key={String(i)}>
                  <p>{problem.description}</p>
                  <span>
                    {format(parseISO(problem.createdAt), 'dd/MM/yyyy')}
                  </span>
                </div>
              ))}
            </>
          )}

          {signature && (
            <>
              <hr />
              <strong>Assinatura do destinatário</strong>
              <img src={signature.url} alt="Assinatura" />
            </>
          )}
        </Scroll>
      </div>
    </Container>
  );
}

LookCustomerService.propTypes = {
  customerService: PropTypes.object.isRequired,
  closeCallback: PropTypes.func.isRequired,
};
