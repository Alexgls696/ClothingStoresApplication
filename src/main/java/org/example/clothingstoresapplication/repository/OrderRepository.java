package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


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

}
