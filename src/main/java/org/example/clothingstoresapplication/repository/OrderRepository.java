package org.example.clothingstoresapplication.repository;

import org.aspectj.weaver.ast.Or;
import org.example.clothingstoresapplication.entity.Employee;
import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends CrudRepository<Order, Integer> {

}
