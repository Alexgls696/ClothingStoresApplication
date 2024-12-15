package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.ProductsType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsTypeRepository extends CrudRepository<ProductsType, Integer> {
    Page<ProductsType> findAll(Pageable pageable);

    @Query(value = "from ProductsType ")
    Page<ProductsType> findAllOrderById(Pageable pageable);

    @Query(value = "from ProductsType ")
    Page<ProductsType> findAllOrderByName(Pageable pageable);
}
