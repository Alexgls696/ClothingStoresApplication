package org.example.clothingstoresapplication.service;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriesServiceImpl implements CategoriesService{

    private CategoriesRepository categoriesRepository;

    @Autowired
    public CategoriesServiceImpl(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }

    @Override
    public Iterable<Category> getCategories() {
        return categoriesRepository.findAll();
    }


    @Override
    public Category addCategory(Category category) {
        return categoriesRepository.save(category);
    }


    @Override
    public Category getCategoryById(int id) {
        return categoriesRepository.findById(id);
    }


    @Override
    public Category updateCategory(Category category) {
        return categoriesRepository.save(category);
    }


    @Override
    public void deleteCategory(int id) {
        categoriesRepository.delete(id);
    }
}
