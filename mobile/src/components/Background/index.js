import React from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';

import { Container, Purple, Content } from './styles';

export default function Background({ children }) {
  return (
    <>
      <StatusBar backgroundColor="#4d85ee" barStyle="light-content" />
      <Container>
        <Purple />
        <Content>{children}</Content>
      </Container>
    </>
  );
}

Background.propTypes = {
  children: PropTypes.element.isRequired,
};
