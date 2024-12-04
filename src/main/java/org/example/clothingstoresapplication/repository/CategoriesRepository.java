package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import java.util.List;

public interface CategoriesRepository{
    List<Category> findAll();
    Category findById(int id);
    Category save(Category category);
    Category update(Category category);
    void delete(int id);
}
