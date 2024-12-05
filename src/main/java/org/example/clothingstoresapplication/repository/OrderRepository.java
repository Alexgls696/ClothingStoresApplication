package org.example.clothingstoresapplication.repository;

import org.aspectj.weaver.ast.Or;
import org.example.clothingstoresapplication.entity.Employee;
import org.example.clothingstoresapplication.entity.Order;

import java.util.List;

public interface OrderRepository {
    List<Order> findAll();
    Order findById(int id);
    Order save(Order order);
    void delete(int id);
}
