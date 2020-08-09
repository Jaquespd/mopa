import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { parseISO, format } from 'date-fns';
import { toast } from 'react-toastify';
import {
  MdPhonelinkErase,
  MdCheckCircle,
  MdChat,
  MdClose,
  MdCheck,
  MdDone,
  MdCancel,
  MdControlPoint,
  MdDoNotDisturb,
  MdReportProblem,
  MdSyncProblem,
} from 'react-icons/md';

import api from '~/services/api';
import TextArea from '~/components/TextArea';

import { Container, Scroll, UnForm } from './styles';

export default function LookService({
  delivery,
  serviceId,
  updateServices,
  closeCallback,
}) {
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [problems, setProblems] = useState([]);
  const [customerService, setCustomerService] = useState([]);
  const [looking, setLooking] = useState(null);

  const formRef = useRef(null);

  // useEffect(() => {
  // document.addEventListener('keyup', closeCallback, false);
  // return () => {
  //   document.removeEventListener('keyup', closeCallback, false);
  // };
  // }, [closeCallback]);

  useEffect(() => {
    // async function urlSignature() {
    //   try {
    //     const response = await api.get(`files/${signature_id}`);
    //     setSignatureUrl(response.data.url);
    //   } catch (err) {
    //     // toast.error('Não foi possível localizar esta assinatura');
    //     // history.push('/services');
    //   }
    // }

    async function getProblems() {
      try {
        const response = await api.get(`service/${serviceId}/problems`);

        setProblems(response.data);
      } catch (err) {
        // toast.error('Não foi possível localizar esta assinatura');
        // history.push('/services');
      }
    }

    if (serviceId) getProblems();

    // if (signature_id) urlSignature();
  }, []);

  async function getProblems() {
    try {
      const response = await api.get(`service/${id}/problems`);

      setProblems(response.data);
    } catch (err) {
      // toast.error('Não foi possível localizar esta assinatura');
      // history.push('/services');
    }
  }

  if (!delivery) return <></>;

  const {
    id,
    city,
    number,
    customer,
    description,
    local,
    situacion,
    subtype,
    type,
    customer_services,
  } = delivery;

  function handleCloseByClick(e) {
    if (e.target.id === 'look-delivery-container') closeCallback();
  }

  async function handleClose(problemId) {
    // eslint-disable-next-line no-alert
    const gonnaDelete = window.confirm(
      `Tem certeza que o problema foi resolvido?`
    );

    if (!gonnaDelete) return;

    await api.put(`service-problem/${problemId}/open`);
    toast.info(`O problema foi marcado como resolvido`);

    const problem = problems.filter((problem) => problemId === problem.id);

    const newProblems = problems.map((problem) => {
      if (problem.id === problemId) {
        problem.open = !problem.open;
        return problem;
      }
      return problem;
    });

    setProblems(newProblems);

    updateServices();
  }

  async function handleSubmit(problemId) {
    const data = formRef.current.getData();

    await api.put(`service-problem/${problemId}/add-comment`, data);

    getProblems();

    toast.info(`O comentário foi registrado.`);

    updateServices();

    formRef.current.reset();

    setLooking(null);
  }

  function inputComments(problemId) {
    return (
      <div>
        <UnForm ref={formRef} onSubmit={() => handleSubmit(problemId)}>
          <TextArea name="comments" label="Digite o comentário" />

          <button type="button" onClick={() => setLooking(null)}>
            <MdClose size={24} color="#DE3B3B" />
            Cancelar
          </button>
          <button type="submit">
            <MdCheck size={24} color="#00FF7F" />
            Confirmar
          </button>
        </UnForm>
      </div>
    );
  }

  return (
    <Container id="look-delivery-container" onClick={handleCloseByClick}>
      <div>
        <Scroll>
          <strong>Informações do serviço.</strong>
          <div key={id}>
            {number && <p>Chamado: {number}</p>}
            {customer && <p>Cliente: {customer}</p>}
            {city && <p>Cidade: {city}</p>}
            {local && <p>Local: {local}</p>}
            {type && <p>Tipo: {type}</p>}
            {subtype && <p>Sub-Tipo: {subtype}</p>}
            {description && <p>Descrição: {description}</p>}
            {situacion && <p>Situação: {situacion.text}</p>}
            {customer_services.length > 0 && (
              <p>Houve {customer_services.length} atendimentos</p>
            )}
            {delivery.problems.length > 0 && (
              <p>Houve {delivery.problems.length} problemas</p>
            )}

            {customer_services.length > 0 &&
              customer_services.map((customerService) => {
                return (
                  <div key={customerService.id}>
                    <hr />
                    <p>Atendimento numero: {customerService.id}</p>
                    <p>Carro: {customerService.car}</p>
                  </div>
                );
              })}

            {problems.length > 0 && (
              <>
                <hr />
                <strong>Problemas ocorridos</strong>
                {problems.map((problem, i) => (
                  <div key={String(i)}>
                    <span>
                      Em {/*format(parseISO(problem.createdAt), 'dd/MM/yyyy')*/}
                      , {/*problem.employee.name*/} informa:
                    </span>

                    <p>{problem.description}</p>

                    {!problem.comments &&
                      looking === problem.id &&
                      inputComments(problem.id)}

                    {problem.comments && (
                      <>
                        <span>Administrador comenta:</span>
                        <p>{problem.comments}</p>
                      </>
                    )}

                    {!problem.open && <p>-resolvido-</p>}

                    {/*canceled_at && <p>Atendimento cancelado</p>*/}

                    {!problem.comments && (
                      <button
                        type="button"
                        onClick={() => setLooking(problem.id)}
                      >
                        <MdChat size={24} color="#00CED1" />
                        comentar
                      </button>
                    )}

                    {problem.open && (
                      <button
                        type="button"
                        onClick={() => handleClose(problem.id)}
                      >
                        <MdCheckCircle size={24} color="#00FF7F" />
                        Resolvido
                      </button>
                    )}

                    {/*problem.open && !canceled_at && (
                      <button
                        type="button"
                        onClick={() => handleCancel(id, service.id)}
                      >
                        <MdPhonelinkErase size={24} color="#DE3B3B" />
                        Cancelar
                      </button>
                    )*/}
                  </div>
                ))}
              </>
            )}
          </div>
        </Scroll>
      </div>
    </Container>
  );
}

LookService.propTypes = {
  delivery: PropTypes.object.isRequired,
  closeCallback: PropTypes.func.isRequired,
};
