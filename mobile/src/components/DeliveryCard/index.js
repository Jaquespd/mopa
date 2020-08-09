import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Content,
  Header,
  Title,
  Footer,
  FooterItem,
  Small,
  SubTitle,
  Button,
  ButtonText,
  IconStyled,
} from './styles';

import Timeline from './Timeline';

export default function DeliveryCard({ navigation, delivery }) {
  return (
    <Container
      style={{
        elevation: 4,
      }}
    >
      <Button onPress={() => navigation.navigate('Detail', { delivery })}>
        <Content>
          <Header>
            <IconStyled
              startDate={delivery.CustomerServiceService.start_date}
              size={25}
              name="build"
            />
            <Title
              startDate={delivery.CustomerServiceService.start_date}
            >{`Nº: ${delivery.number}`}</Title>
            {delivery.problems.length > 0 && (
              <Icon size={25} name="sync-problem" color="#DE3B3B" />
            )}
          </Header>

          {/** 
        <Timeline
          start={delivery.CustomerServiceService.start_date}
          end={delivery.CustomerServiceService.end_date}
        />
        */}
        </Content>
        <Footer>
          <FooterItem>
            <Small>Data</Small>
            <SubTitle>{delivery.formattedDate}</SubTitle>
          </FooterItem>

          <FooterItem>
            <Small>Cidade</Small>
            <SubTitle>{delivery.city}</SubTitle>
          </FooterItem>

          <FooterItem>
            <Small>Resumo</Small>
            <SubTitle>{delivery.subtype}</SubTitle>
          </FooterItem>
        </Footer>
      </Button>
    </Container>
  );
}

DeliveryCard.propTypes = {
  delivery: PropTypes.shape({
    formattedId: PropTypes.string.isRequired,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    formattedDate: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
