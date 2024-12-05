package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CustomersRepository {
    List<Customer> findAll();
    Customer findById(int id);
    Customer save(Customer category);
    void delete(int id);
}
