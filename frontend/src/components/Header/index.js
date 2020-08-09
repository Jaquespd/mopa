import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Container } from './styles';
import logo from '~/assets/logo.png';

import * as AuthActions from '~/store/modules/auth/actions';

export default function Header({ locationName = undefined }) {
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(AuthActions.signOut());
  }

  return (
    <Container locationName={locationName}>
      <Link to="/customerservices">
        <img src={logo} alt="MOPA" />
      </Link>

      <Link data-name="customerservices" to="/customerservices">
        Atendimentos
      </Link>
      <Link data-name="services" to="/services">
        Serviços
      </Link>
      <Link data-name="employees" to="/employees">
        Funcionários
      </Link>

      <div>
        <strong>Admin MOPA</strong>
        <button type="button" onClick={handleSignOut}>
          Sair do sistema
        </button>
      </div>
    </Container>
  );
}

Header.propTypes = {
  locationName: PropTypes.string,
};
