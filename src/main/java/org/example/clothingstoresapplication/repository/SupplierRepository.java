package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SupplierRepository extends CrudRepository<Supplier, Integer> {
    Page<Supplier> findAll(Pageable pageable);

    @Query(value = "from Category ")
    Page<Supplier> findAllOrderById(Pageable pageable);

    @Query(value = "from Category ")
    Page<Supplier> findAllOrderBySupplierName(Pageable pageable);
}
