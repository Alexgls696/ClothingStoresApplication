package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomersRepository extends CrudRepository<Customer, Integer>{
    Page<Customer> findAll(Pageable pageable);

    @Query(value = "from Customer ")
    Page<Customer> findAllOrderById(Pageable pageable);

    @Query(value = "from Customer ")
    Page<Customer> findAllOrderByFirstName(Pageable pageable);

    @Query(value = "from Customer ")
    Page<Customer> findAllOrderByLastName(Pageable pageable);

    @Query(value = "from Customer ")
    Page<Customer> findAllOrderByEmail(Pageable pageable);

    @Query(value = "from Customer ")
    Page<Customer> findAllOrderByPhoneNumber(Pageable pageable);

    @Query(value = "from Customer ")
    Page<Customer> findAllOrderByIdOrderId(Pageable pageable);

    Page<Customer> findAllById(int id, Pageable pageable);
    Page<Customer> findAllByEmailLikeIgnoreCase(String email, Pageable pageable);
    Page<Customer> findAllByPhoneNumberLikeIgnoreCase(String phoneNumber, Pageable pageable);
    Page<Customer> findAllByFirstNameLikeIgnoreCase(String firstName, Pageable pageable);
    Page<Customer> findAllByLastNameLikeIgnoreCase(String lastName, Pageable pageable);
    Page<Customer> findAllByOrderId(int orderId, Pageable pageable);
}
