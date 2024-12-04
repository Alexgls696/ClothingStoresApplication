package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.service.CategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoriesRestController {
    private CategoriesService categoriesService;

    @Autowired
    public CategoriesRestController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    @GetMapping
    public Iterable<Category>getCategories() {
        var list = categoriesService.getCategories();
        return list;
    }

    @GetMapping("/{id}")
    public Category getCategory(@PathVariable("id") int id){
        return categoriesService.getCategoryById(id);
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category){
        return categoriesService.addCategory(category);
    }

    @PutMapping
    public Category updateCategory(@RequestBody Category category){
        return categoriesService.updateCategory(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable("id") int id){
        categoriesService.deleteCategory(id);
    }
}
