package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CategoriesRepository extends CrudRepository<Category, Integer> {
    Page<Category> findAll(Pageable pageable);

    @Query(value = "from Category ")
    Page<Category> findAllOrderById(Pageable pageable);

    @Query(value = "from Category ")
    Page<Category> findAllOrderByCategoryName(Pageable pageable);

    Page<Category> findAllByCategoryNameLikeIgnoreCase(String categoryName, Pageable pageable);
    Page<Category> findAllByCategoryIdOrderByCategoryId(long id,Pageable pageable);
}