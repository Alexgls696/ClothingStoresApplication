package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderProduct;

import java.util.List;

public interface OrderProductRepository {
    List<OrderProduct> findAll();
    OrderProduct findById(int id);
    OrderProduct save(OrderProduct order);
    void delete(int id);
}
