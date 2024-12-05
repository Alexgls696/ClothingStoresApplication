package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.entity.Employee;

import java.util.List;

public interface EmployeeRepository {
    List<Employee> findAll();

    Employee findById(int id);

    Employee save(Employee category);

    void delete(int id);
}
