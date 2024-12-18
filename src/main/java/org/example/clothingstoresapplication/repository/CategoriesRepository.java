package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriesRepository extends CrudRepository<Category, Integer> {
    Page<Category> findAll(Pageable pageable);

    @Query(value = "from Category ")
    Page<Category> findAllOrderById(Pageable pageable);

    @Query(value = "from Category ")
    Page<Category> findAllOrderByCategoryName(Pageable pageable);

    Page<Category> findAllByCategoryNameLikeIgnoreCase(String categoryName, Pageable pageable);
    Page<Category> findAllByCategoryIdOrderByCategoryId(long id,Pageable pageable);

    @Query(nativeQuery = true,value = "select * from main_schema.get_sorted_categories(:findBy,:findValue,:sortBy,:sortType)")
    List<Category>findAllCategoriesByParams(String findBy,String findValue,String sortBy, String sortType);
}