import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import { Loading, UnForm, Button, Card } from './styles';
import { PageTitle } from '~/styles/PageTittle';

import Input from '~/components/Input';

import api from '~/services/api';
import history from '~/services/history';

import AsyncSelect from '~/components/AsyncSelectInput';

const schema = Yup.object().shape({
  customer: Yup.string().required('Este campo é obrigatório'),
  city: Yup.string().required('Este campo é obrigatório'),
  local: Yup.string().required('Este campo é obrigatório'),
  type: Yup.string(),
  subtype: Yup.string(),
  description: Yup.string(),
});

export default function NewService({ match }) {
  const id = match.params.id ? decodeURIComponent(match.params.id) : null;
  const [service, setService] = useState(null);

  useEffect(() => {
    async function getService() {
      try {
        const { data } = await api.get(`services/${id}`);
        setService(data);
      } catch (err) {
        toast.error('Não foi possível localizar este serviço');
        history.push('/services');
      }
    }

    if (id) {
      getService();
    }
  }, [id]);

  // new function select citys

  const selectCities = [
    {
      label: 'Macaíba',
      value: 'Macaíba',
    },
    {
      label: 'Goianinha',
      value: 'Goianinha',
    },
    {
      label: 'Monte Alegre',
      value: 'Monte Alegre',
    },
    {
      label: 'Touros',
      value: 'Touros',
    },
    {
      label: 'Mossoró',
      value: 'Mossoró',
    },
  ];

  function handleGoBack() {
    history.push('/services');
  }

  async function handleSubmit(data) {
    if (id) {
      try {
        await api.put(`services/${id}`, data);
        toast.success('Serviço alterado com sucesso!');
        history.push('/services');
      } catch (err) {
        toast.error(
          'Não foi possível realizar a alteração, verifique seus dados'
        );
      }
    } else {
      try {
        const service = await api.post('services', data);
        // await api.put(`service/${service.id}/state`, { state: 'ABERTO' });
        toast.success('Serviço cadastrado com sucesso!');
        history.push('/services');
      } catch (err) {
        toast.error(
          'Não foi possível realizar o cadastro, verifique seus dados'
        );
      }
    }
  }

  if (id && !service) {
    return (
      <Loading>
        <AiOutlineLoading />
      </Loading>
    );
  }
  return (
    <UnForm
      schema={schema}
      initialData={service || undefined}
      onSubmit={handleSubmit}
    >
      <header>
        <PageTitle>Cadastro de serviço</PageTitle>
        <Button type="button" onClick={handleGoBack}>
          <MdKeyboardArrowLeft size={24} />
          Voltar
        </Button>
        <Button color="#4d85ee" type="submit">
          <MdDone size={24} />
          Salvar
        </Button>
      </header>
      <Card>
        <Input
          label="Cliente"
          name="customer"
          placeholder="Ex: Jacinto Pinto"
        />
        <AsyncSelect
          label="Cidade"
          name="city"
          placeholder="Selecione uma cidade"
          cacheOptions
          defaultOptions={selectCities}
          loadOptions={selectCities}
        />
        <Input label="Local" name="local" placeholder="Ex: Protocolo" />
        <Input
          label="Tipo de serviço"
          name="type"
          placeholder="Ex: Elétrico, Refrigeração"
        />
        <Input
          label="Subtipo do serviço"
          name="subtype"
          placeholder="Ex: Novo ponto elétrico"
        />
        <Input
          label="Descrição"
          name="description"
          placeholder="Ex: Descrição do problema"
        />
      </Card>
    </UnForm>
  );
}

NewService.propTypes = {
  match: PropTypes.object.isRequired,
};
