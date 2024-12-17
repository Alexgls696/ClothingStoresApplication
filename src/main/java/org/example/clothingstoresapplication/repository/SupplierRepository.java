package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
@Transactional
public interface SupplierRepository extends CrudRepository<Supplier, Integer> {
    Page<Supplier> findAll(Pageable pageable);

    @Query(value = "from Supplier ")
    Page<Supplier> findAllOrderById(Pageable pageable);

    @Query(value = "from Supplier ")
    Page<Supplier> findAllOrderBySupplierName(Pageable pageable);

    Page<Supplier>findAllBySupplierId(Integer id, Pageable pageable);
    Page<Supplier>findAllBySupplierNameLikeIgnoreCase(String name, Pageable pageable);
}
