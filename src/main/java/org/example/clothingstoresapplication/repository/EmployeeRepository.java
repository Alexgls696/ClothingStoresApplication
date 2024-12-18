package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.entity.Employee;
import org.example.clothingstoresapplication.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Integer> {
    Page<Employee> findAll(Pageable pageable);

    @Query(value = "from Employee ")
    Page<Employee> findAllOrderById(Pageable pageable);

    @Query(value = "from Employee ")
    Page<Employee> findAllOrderByFirstName(Pageable pageable);

    @Query(value = "from Employee ")
    Page<Employee> findAllOrderByLastName(Pageable pageable);

    @Query(value = "from Employee ")
    Page<Employee> findAllOrderByStoreId(Pageable pageable);

    @Query(value = "from Employee ")
    Page<Employee> findAllOrderByPosition(Pageable pageable);

    @Query(value = "from Employee ")
    Page<Employee> findAllOrderByEmail(Pageable pageable);

    Page<Employee> findAllByEmployeeId(int id,Pageable pageable);
    Page<Employee> findAllByEmailLikeIgnoreCase(String email,Pageable pageable);
    Page<Employee> findAllByFirstNameLikeIgnoreCase(String firstName,Pageable pageable);
    Page<Employee> findAllByLastNameLikeIgnoreCase(String lastName,Pageable pageable);
    Page<Employee> findAllByStoreId(int storeId,Pageable pageable);
    Page<Employee> findAllByPositionLikeIgnoreCase(String position,Pageable pageable);
}
