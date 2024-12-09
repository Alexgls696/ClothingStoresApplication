package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderStatus;

import java.util.List;

public interface OrderStatusRepository {
    List<OrderStatus> findAll();
    OrderStatus findById(int id);
    OrderStatus save(OrderStatus order);
    void delete(int id);
}
