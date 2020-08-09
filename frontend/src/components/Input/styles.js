import styled from 'styled-components';
// import { Input } from '@unform/web';

export const Container = styled.div`
  padding-bottom: 10px;

  strong {
    /* text-transform: uppercase; */
    margin-bottom: 9px;
    color: #444444;
    display: block;
  }

  input + span {
    color: #de3b3b;
    padding-top: 5px;
    display: block;
  }
`;

export const UnInput = styled.input`
  padding: 12px 15px;
  border-radius: 4px;
  border: 1px solid #dddddd;
  color: #999999;
  font-size: 16px;
  width: 100%;

  &::placeholder {
    color: rgba(153, 153, 153, 0.7);
  }
`;
