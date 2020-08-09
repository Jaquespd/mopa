import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const IconStyled = styled(Icon)`
  color: ${(props) => (props.startDate ? '#82BF18' : '#4d85ee')};
`;

export const Container = styled.View`
  margin-top: 5px;
  border-radius: 4px;
  background: #fff;
  margin-bottom: 15px;
  margin-left: 5px;
  margin-right: 5px;
`;

export const Content = styled.View`
  padding: 5px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  color: ${(props) => (props.startDate ? '#82BF18' : '#4d85ee')};

  /* color: #82BF18; */
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
`;

export const Footer = styled.View`
  background: #f8f9fd;
  padding: 5px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const FooterItem = styled.View`
  flex-direction: column;
`;

export const Small = styled.Text`
  font-weight: bold;
  font-size: 8px;
  color: #999999;
`;

export const SubTitle = styled.Text`
  font-weight: bold;
  font-size: 12px;
  color: #444444;
`;

export const Button = styled.TouchableOpacity``;

export const ButtonText = styled(SubTitle)`
  color: #4d85ee;
`;
