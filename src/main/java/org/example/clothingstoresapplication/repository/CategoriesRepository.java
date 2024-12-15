package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriesRepository extends CrudRepository<Category, Integer> {

    Page<Category> findAll(Pageable pageable);
    @Query(value = "from Category ")
    Page<Category> findAllOrderById(Pageable pageable);

    @Query(value = "from Category ")
    Page<Category> findAllOrderByCategoryName(Pageable pageable);
}