package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusRepository extends CrudRepository<OrderStatus, Integer> {
    Page<OrderStatus> findAll(Pageable pageable);

    @Query(value = "from OrderStatus ")
    Page<OrderStatus> findAllOrderById(Pageable pageable);

    @Query(value = "from OrderStatus ")
    Page<OrderStatus> findAllOrderByName(Pageable pageable);
}
