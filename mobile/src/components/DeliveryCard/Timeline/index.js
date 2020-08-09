import React from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Line,
  StatusContainer,
  LabelContainer,
  Dot,
  Label,
} from './styles';

export default function Timeline({ start = null, end = null }) {
  const taken = !!start;
  const delivered = !!end;

  return (
    <Container>
      <Line />
      <StatusContainer>
        <LabelContainer>
          <Dot filled />
          <Label>Distribuido</Label>
        </LabelContainer>

        <LabelContainer>
          <Dot filled={taken} />
          <Label>Iniciado</Label>
        </LabelContainer>

        <LabelContainer>
          <Dot filled={delivered} />
          <Label>Concluido</Label>
        </LabelContainer>
      </StatusContainer>
    </Container>
  );
}

Timeline.defaultProps = {
  start: null,
  end: null,
};

Timeline.propTypes = {
  start: PropTypes.string,
  end: PropTypes.string,
};
