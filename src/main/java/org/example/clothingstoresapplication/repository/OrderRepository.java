package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface OrderRepository extends CrudRepository<Order, Integer> {
    Page<Order> findAll(Pageable pageable);

    @Query(value = "from Order ")
    Page<Order> findAllOrderById(Pageable pageable);

    @Query(value = "from Order ")
    Page<Order> findAllOrderByOrderDate(Pageable pageable);

    @Query(value = "from Order ")
    Page<Order> findAllOrderByStoreId(Pageable pageable);

    @Query(value = "from Order ")
    Page<Order> findAllOrderByStatusId(Pageable pageable);

    Page<Order> findAllById(Integer orderId, Pageable pageable);
    Page<Order> findAllByStore(Store store, Pageable pageable);
    Page<Order> findAllByStatus(OrderStatus orderStatus, Pageable pageable);

}
