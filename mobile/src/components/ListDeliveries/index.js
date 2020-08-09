import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { format, parseISO } from 'date-fns';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';

import {
  Container,
  List,
  Loading,
  Empty,
  EmptyLabel,
  Lottie,
  LoadingMoreContainer,
  LoadingMoreSpinner,
  LoadingMoreText,
} from './styles';

import noVisibility from '~/assets/visibility-off.json';

import api from '~/services/api';

import DeliveryCard from '~/components/DeliveryCard';

export default function ListDeliveries({ navigation, mode = 'pending' }) {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const id = useSelector((store) => store.deliveryman.profile.id);

  function parseDeliveries(items) {
    return items.map((delivery) => ({
      ...delivery,
      formattedId: delivery.id < 10 ? `0${delivery.id}` : String(delivery.id),
      formattedDate: format(parseISO(delivery.createdAt), 'dd/MM/yyyy'),
      services: delivery.services.map((service) => ({
        ...service,
        formattedId:
          service.id < 10
            ? `${service.CustomerServiceService.customer_service_id}-0${service.id}`
            : `${service.CustomerServiceService.customer_service_id}-${service.id}`,
        formattedDate: format(
          parseISO(service.CustomerServiceService.createdAt),
          'dd/MM/yyyy'
        ),
        car: delivery.car,
        partner: delivery.employees
          .filter((employee) => employee.id !== id)
          .map((employee) => employee.name),
      })),
    }));
  }

  const loadDeliveries = useCallback(async () => {
    setDeliveries([]);
    setLoading(true);
    setPage(1);
    try {
      let url = `employee/${id}/customerservices`;
      if (mode === 'delivered') url += '?completed=true';

      const { data } = await api.get(url);
      setDeliveries(parseDeliveries(data));
    } catch (err) {
      Alert.alert(
        'Falha na requisição',
        'Não foi possível buscar os serviços, por favor tente mais tarde.'
      );
    }
    setLoading(false);
  }, [id, mode]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const handleRefresh = useCallback(async () => {
    setHasMore(false);
    setRefreshing(true);
    setDeliveries([]);
    setPage(1);

    try {
      let url = `employee/${id}/customerservices`;
      if (mode === 'delivered') url += '?completed=true';

      const { data } = await api.get(url);
      setDeliveries(parseDeliveries(data));
    } catch (err) {
      Alert.alert(
        'Falha na requisição',
        'Não foi possível buscar os serviços, por favor tente mais tarde.'
      );
    }
    setRefreshing(false);
    setHasMore(true);
  }, [id, mode]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const params = { page: page + 1 };
      const url = `employee/${id}/customerservices`;

      if (mode === 'delivered') {
        params.completed = true;
      }

      const { data } = await api.get(url, { params });

      if (data.length > 0) {
        setDeliveries([...deliveries, ...parseDeliveries(data)]);
        setPage(page + 1);
        console.tron.log(page);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      Alert.alert(
        'Falha na requisição',
        'Não foi possível buscar os serviços, por favor tente mais tarde.'
      );
    }

    setLoadingMore(false);
  }, [hasMore, loadingMore, id, mode, page, deliveries]);

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          {deliveries.length > 0 || refreshing ? (
            <>
              <List
                data={deliveries}
                keyExtractor={(delivery) => String(delivery.id)}
                renderItem={({ item }) =>
                  item.services.map((service) => (
                    <DeliveryCard
                      startDate={true}
                      key={service.id}
                      navigation={navigation}
                      delivery={service}
                    />
                  ))
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReachedThreshold={0.5}
                onEndReached={loadMore}
                ListFooterComponent={
                  hasMore && (
                    <LoadingMoreContainer>
                      <LoadingMoreSpinner />
                      <LoadingMoreText>Carregando...</LoadingMoreText>
                    </LoadingMoreContainer>
                  )
                }
              />
            </>
          ) : (
            <Empty>
              <Lottie source={noVisibility} autoPlay loop />
              <EmptyLabel>Sem serviços por aqui</EmptyLabel>
            </Empty>
          )}
        </>
      )}
    </Container>
  );
}

ListDeliveries.defaultProps = {
  mode: 'Pending',
};

ListDeliveries.propTypes = {
  navigation: PropTypes.instanceOf(Object).isRequired,
  mode: PropTypes.string,
};
