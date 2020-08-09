import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdAdd, MdEdit, MdDeleteForever } from 'react-icons/md';

import { Container, EmployeeField, Avatar, LetterAvatar } from './styles';

import { PageTitle } from '~/styles/PageTittle';

import SearchInput from '~/components/SearchInput';
import Actions from '~/components/Actions';
import Table from '~/components/Table';
import Pagination from '~/components/Pagination';

import api from '~/services/api';
import history from '~/services/history';

import { createLetterAvatar } from '~/util/letterAvatar';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');

  const parseEmployees = useCallback((data) => {
    return data.map((employee, index) => {
      employee.idText =
        employee.id > 9 ? `#${employee.id}` : `#0${employee.id}`;

      employee.letterAvatar = createLetterAvatar(employee.name, index);

      return employee;
    });
  }, []);

  const handleSearch = async (search) => {
    const response = await api.get(`employees?q=${search}`);
    const data = parseEmployees(response.data.items);
    setEmployees(data);
    setSearchText(search);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  };

  const handleEdit = useCallback((employee) => {
    history.push(`/employees/edit/${employee.id}`);
  }, []);

  const handleDelete = useCallback(
    async (employee) => {
      // eslint-disable-next-line no-alert
      const gonnaDelete = window.confirm(
        `Tem certeza que deseja excluir o entregador ${employee.idText}?`
      );

      if (!gonnaDelete) return;

      await api.delete(`employees/${employee.id}`);
      toast.info(`O funcionário ${employee.idText} foi excluído!`);
      setEmployees(employees.filter(({ id }) => id !== employee.id));
    },
    [employees]
  );

  async function handlePagination(n) {
    const params = {
      page: n,
      q: searchText,
    };

    const response = await api.get('employees', { params });
    const data = parseEmployees(response.data.items);
    setEmployees(data);
    setPage(response.data.page);
    setPages(response.data.pages);
    setTotal(response.data.total);
  }

  useEffect(() => {
    async function getEmployees() {
      const response = await api.get('employees');
      const data = parseEmployees(response.data.items);
      setEmployees(data);
      setPage(response.data.page);
      setPages(response.data.pages);
      setTotal(response.data.total);
    }

    getEmployees();
  }, [parseEmployees]);

  return (
    <Container>
      <header>
        <PageTitle>Gerenciando funcionários</PageTitle>
      </header>
      <div>
        <SearchInput
          placeholder="Buscar por funcionário"
          callback={handleSearch}
        />
        <Link to="/employees/new">
          <MdAdd color="#FFFFFF" size={26} />
          Cadastrar
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={String(employee.id)}>
              <td>{employee.idText}</td>

              <EmployeeField>
                {employee.avatar ? (
                  <Avatar src={employee.avatar.url} />
                ) : (
                  <LetterAvatar color={employee.letterAvatar.color}>
                    {employee.letterAvatar.letters}
                  </LetterAvatar>
                )}
              </EmployeeField>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.phone}</td>
              <td>{employee.email}</td>
              <td>
                <Actions>
                  <button type="button" onClick={() => handleEdit(employee)}>
                    <MdEdit size={24} color="#4D85EE" />
                    Editar
                  </button>
                  <button type="button" onClick={() => handleDelete(employee)}>
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
