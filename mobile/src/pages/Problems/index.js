import React from 'react';
import PropTypes from 'prop-types';

import { format, parseISO } from 'date-fns';

import Background from '~/components/Background';

import {
  Container,
  Title,
  ProblemsList,
  ProblemCard,
  ProblemText,
  DateText,
  NoProblem,
  NoProblemContainer,
} from './styles';

export default function Problems({ navigation }) {
  const problems = navigation.getParam('problems').map((problem) => ({
    ...problem,
    formattedDate: format(parseISO(problem.createdAt), 'dd/MM/yyyy'),
  }));

  const formattedId = navigation.getParam('formattedId');
  console.log(problems);

  return (
    <Background>
      <Container>
        <Title>{`Serviço nº: ${problems[0].service_id}`}</Title>

        {problems.length === 0 ? (
          <NoProblemContainer>
            <NoProblem>Nenhum problema com este serviço</NoProblem>
          </NoProblemContainer>
        ) : (
          <ProblemsList>
            {problems.map((problem) => (
              <ProblemCard key={problem.createdAt} style={{ elevation: 3 }}>
                <ProblemText>
                  Em {problem.formattedDate}, {problem.employee_id} relatou que:
                </ProblemText>
                <ProblemText>{problem.description}</ProblemText>
                <ProblemText>O Administrador comentou:</ProblemText>
                <ProblemText>{problem.comments}</ProblemText>
                <DateText>{problem.formattedDate}</DateText>
              </ProblemCard>
            ))}
          </ProblemsList>
        )}
      </Container>
    </Background>
  );
}

Problems.navigationOptions = () => ({
  title: 'Visualizar problemas',
});

Problems.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
