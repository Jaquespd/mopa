import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { MdDone, MdKeyboardArrowLeft } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import { Loading, UnForm, Button, Card } from './styles';
import { PageTitle } from '~/styles/PageTittle';

import AvatarInput from './AvatarInput';
import Input from '~/components/Input';

import api from '~/services/api';
import history from '~/services/history';

const schema = Yup.object().shape({
  avatar_id: Yup.number(),
  name: Yup.string().required('Este campo é obrigatório'),
  role: Yup.string().required('Este campo é obrigatório'),
  phone: Yup.string().required('Este campo é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Este campo é obrigatório'),
});

export default function NewEmployee({ match }) {
  // depois verificar pq foi usado o decodeURIComponent
  const id = match.params.id ? decodeURIComponent(match.params.id) : null;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    async function getEmployee() {
      try {
        const { data } = await api.get(`/employees/${id}`);
        setEmployee(data);
      } catch (err) {
        toast.error('Não foi possível localizar este funcionário');
        history.push('/employees');
      }
    }

    if (id) {
      getEmployee();
    }
  }, [id]);

  function handleGoBack() {
    history.push('/employees');
  }

  async function handleSubmit(data) {
    if (id) {
      try {
        await api.put(`/employees/${id}`, data);
        toast.success('Funcionário editado com sucesso!');
        history.push('/employees');
      } catch (err) {
        toast.error(
          'Não foi possível editar este funcionário, verifique seus dados.'
        );
      }
    } else {
      try {
        await api.post('/employees', data);
        toast.success('Funcionário cadastrado com sucesso!');
        history.push('/employees');
      } catch (err) {
        toast.error(
          'Não foi possível realizar o cadastro, verifique seus dados.'
        );
      }
    }
  }

  if (id && !employee) {
    return (
      <Loading>
        <AiOutlineLoading />
      </Loading>
    );
  }

  return (
    <UnForm
      schema={schema}
      initialData={employee || undefined}
      onSubmit={handleSubmit}
    >
      <header>
        <PageTitle>
          {employee ? 'Editar funcionário' : 'Cadastrar funcionário'}
        </PageTitle>
        <Button type="button" onClick={handleGoBack}>
          <MdKeyboardArrowLeft size={24} />
          Voltar
        </Button>
        <Button color="#4D85EE" type="submit">
          <MdDone size={24} />
          Salvar
        </Button>
      </header>
      <Card>
        <AvatarInput name="avatar_id" />
        <Input label="Nome" name="name" placeholder="Chico Bioca" />
        <Input label="Cargo" name="role" placeholder="Eletricista" />
        <Input label="Telefone" name="phone" placeholder="84 98855-0000" />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="chico@gmail.com"
        />
      </Card>
    </UnForm>
  );
}

NewEmployee.propTypes = {
  match: PropTypes.object.isRequired,
};
