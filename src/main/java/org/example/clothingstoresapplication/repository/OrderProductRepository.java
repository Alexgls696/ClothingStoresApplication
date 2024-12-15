package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderProduct;
import org.example.clothingstoresapplication.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Random;

@Repository
public interface OrderProductRepository extends CrudRepository<OrderProduct, Integer> {

}
