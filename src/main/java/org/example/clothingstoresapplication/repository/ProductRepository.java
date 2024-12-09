package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.entity.Product;

import java.util.List;

public interface ProductRepository {
    List<Product> findAll();
    Product findById(int id);
    Product save(Product order);
    void delete(int id);
}
