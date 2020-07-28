import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';

import { Container, Scroll } from './styles';

export default function LookCustomerService({ delivery, closeCallback }) {
  useEffect(() => {
    document.addEventListener('keyup', closeCallback, false);
    return () => {
      document.removeEventListener('keyup', closeCallback, false);
    };
  }, [closeCallback]);
  if (!delivery) return <></>;

  const {
    car,
    start_date,
    end_date,
    canceled_at,
    services,
    problems,
    signature,
  } = delivery;

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
  console.log(services);

  return (
    <Container id="look-delivery-container" onClick={handleCloseByClick}>
      <div>
        <Scroll>
          <strong>Informações do atendimento.</strong>
          <p>{car}</p>
          {services &&
            services.map((service) => {
              return (
                <div key={service.id}>
                  {service.customer && <p>Cliente: {service.customer}</p>}
                  {service.city && <p>Cidade: {service.city}</p>}
                  {service.local && <p>Local: {service.local}</p>}
                  {service.type && <p>Tipo: {service.type}</p>}
                  {service.subtype && <p>Sub-Tipo: {service.subtype}</p>}
                  {service.description && (
                    <p>Descrição: {service.description}</p>
                  )}
                  {service.situacion && (
                    <p>Situação: {service.situacion.text}</p>
                  )}

                  {(service.CustomerServiceService.start_date ||
                    service.CustomerServiceService.end_date ||
                    service.CustomerServiceService.canceled_at) && (
                    <>
                      <hr />
                      <p>
                        <strong>Datas</strong>
                      </p>
                    </>
                  )}

                  {service.CustomerServiceService.signature_id && (
                    <>
                      <hr />
                      <strong>Assinatura do destinatário</strong>
                      <img
                        src={service.CustomerServiceService.signature_id}
                        alt="Assinatura"
                      />
                    </>
                  )}
                </div>
              );
            })}

          {signature && (
            <>
              <hr />
              <strong>Assinatura do destinatário</strong>
              <img src={signature.url} alt="Assinatura" />
            </>
          )}

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

          {problems && (
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
        </Scroll>
      </div>
    </Container>
  );
}

LookCustomerService.propTypes = {
  delivery: PropTypes.object.isRequired,
  closeCallback: PropTypes.func.isRequired,
};
