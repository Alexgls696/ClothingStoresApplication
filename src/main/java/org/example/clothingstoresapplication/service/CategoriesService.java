package org.example.clothingstoresapplication.service;

import org.example.clothingstoresapplication.entity.Category;


public interface CategoriesService {
    Iterable<Category> getCategories();
    Category addCategory(Category category);
    Category getCategoryById(int id);
    Category updateCategory(Category category);
    void deleteCategory(int id);
}
