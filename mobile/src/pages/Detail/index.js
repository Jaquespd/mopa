import React, { useState } from 'react';
import Toast from 'react-native-simple-toast';

import { useSelector } from 'react-redux';
import { Alert, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackActions, NavigationActions } from 'react-navigation';

import Background from '~/components/Background';
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  Title,
  Subtitle,
  DateRow,
  DateContainer,
  TakeOutButton,
  Actions,
  ActionButton,
  ActionButtonText,
  VerticalSeparator,
  ScrollList,
} from './styles';

import api from '~/services/api';

export default function Detail({ navigation }) {
  const deliverymanId = useSelector((store) => store.deliveryman.profile.id);
  const [loading, setLoading] = useState(false);

  const {
    id,
    car,
    customer,
    partner,
    description,
    CustomerServiceService,
    canceled_at,
    problems,
    formattedId,
  } = navigation.getParam('delivery');

  console.log(navigation.getParam('delivery'));

  const customerService_id = CustomerServiceService.customer_service_id;

  const { start_date, end_date } = CustomerServiceService;

  const formattedAddress = `${'recipient.street'}, ${'recipient.number'}${
    'recipient.complement' ? ` [${'recipient.complement'}]` : ``
  }, ${'recipient.city'} - ${'recipient.state'}`;

  let status = 'Pendente';

  if (canceled_at) status = 'Cancelado';
  else if (end_date) status = 'Finalizado';
  else if (start_date) status = 'Iniciado';

  const formattedStartDate = start_date
    ? format(parseISO(start_date), 'dd/MM/yyyy')
    : '-- / -- / --';

  const formattedEndDate = end_date
    ? format(parseISO(end_date), 'dd/MM/yyyy')
    : '-- / -- / --';

  function navigationReset() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Deliveries' })],
    });
    navigation.dispatch(resetAction);
  }

  async function handleTakeout() {
    setLoading(true);
    try {
      await api.put(
        `/employee/${deliverymanId}/customerservice/${customerService_id}/service/${id}`
      );
      setLoading(false);
      Toast.show('Serviço iniciado');
      navigationReset();
    } catch (err) {
      Alert.alert(
        'Erro ao iniciar serviço',
        'Não foi possível iniciar o serviço, tente novamente mais tarde'
      );
    }
    setLoading(false);
  }

  return (
    <Background>
      <Container>
        <ScrollList>
          <Card style={{ elevation: 3 }}>
            <CardHeader>
              <Icon size={25} name="build" color="#4d85ee" />
              <CardTitle>Informações do serviço</CardTitle>
            </CardHeader>

            <Title>Chamado</Title>
            <Subtitle>{customer}</Subtitle>

            <Title>Descrição</Title>
            <Subtitle>{description}</Subtitle>

            <Title>Parceiro</Title>
            {partner.map((p) => (
              <Subtitle>{p}</Subtitle>
            ))}

            <Title>Carro</Title>
            <Subtitle>{car}</Subtitle>
          </Card>

          <Card style={{ elevation: 3 }}>
            <CardHeader>
              <Icon size={25} name="event" color="#4d85ee" />
              <CardTitle>Situação do serviço</CardTitle>
            </CardHeader>

            <Title>Status</Title>
            <Subtitle>{status}</Subtitle>

            <DateRow>
              <DateContainer>
                <Title>Data de inicio</Title>
                <Subtitle>{formattedStartDate}</Subtitle>
              </DateContainer>

              <DateContainer>
                <Title>Data de conclusão</Title>
                <Subtitle>{formattedEndDate}</Subtitle>
              </DateContainer>
            </DateRow>
          </Card>

          {!start_date ? (
            <TakeOutButton loading={loading} onPress={handleTakeout}>
              Iniciar Serviço
            </TakeOutButton>
          ) : (
            <>
              {!end_date && (
                <Actions style={{ elevation: 3 }}>
                  <ActionButton
                    onPress={() =>
                      navigation.navigate('NewProblem', {
                        deliveryId: customerService_id,
                        employeeId: deliverymanId,
                        serviceId: id,
                      })
                    }
                  >
                    <Icon name="highlight-off" color="#E74040" size={25} />
                    <ActionButtonText>Informar</ActionButtonText>
                    <ActionButtonText>Problema</ActionButtonText>
                  </ActionButton>
                  <VerticalSeparator />
                  <ActionButton
                    onPress={() =>
                      navigation.navigate('Problems', { formattedId, problems })
                    }
                  >
                    <Icon name="info-outline" color="#E7BA40" size={25} />
                    <ActionButtonText>Visualizar</ActionButtonText>
                    <ActionButtonText>Problemas</ActionButtonText>
                  </ActionButton>
                  <VerticalSeparator />
                  <ActionButton
                    onPress={() =>
                      navigation.navigate('Confirm', {
                        deliveryId: customerService_id,
                        serviceId: id,
                      })
                    }
                  >
                    <Icon name="alarm-on" color="#4d85ee" size={25} />
                    <ActionButtonText>Confirmar</ActionButtonText>
                    <ActionButtonText>Conclusão</ActionButtonText>
                  </ActionButton>
                </Actions>
              )}
            </>
          )}
        </ScrollList>
      </Container>
    </Background>
  );
}

Detail.navigationOptions = () => ({
  title: 'Detalhes',
});

Detail.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
