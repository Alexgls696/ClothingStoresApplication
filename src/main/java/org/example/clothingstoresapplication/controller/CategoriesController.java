package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.repository.CategoriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@Transactional
public class CategoriesController {
    private CategoriesRepository categoriesRepository;

    @Autowired
    public CategoriesController(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
    }


    @GetMapping
    public Iterable<Category>getCategories() {
        return categoriesRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Category getCategory(@PathVariable("id") int id){
        return categoriesRepository.findById(id).orElse(null);
    }


    @PostMapping
    public Category addCategory(@RequestBody Category category){
        return categoriesRepository.save(category);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<Category> categories){
        categoriesRepository.saveAll(categories);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        categoriesRepository.deleteAllById(ids);
    }

    @PutMapping
    public Category updateCategory(@RequestBody Category category){
        return categoriesRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable("id") int id){
        categoriesRepository.deleteById(id);
        System.out.println();
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Category> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"categoryId");
        return categoriesRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByName/{type}")
    public Iterable<Category> getCategoriesByName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"categoryName");
        return categoriesRepository.findAllOrderByCategoryName(pageable(sort));
    }

    @GetMapping("/findBy")
    public Iterable<Category> getCategoriesBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");

        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);

        var result = switch (findBy) {
            case "categoryId" -> categoriesRepository.findAll(pageable(sort));
            case "categoryName" -> categoriesRepository.findAllByCategoryNameLikeIgnoreCase(findValue+"%", pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
        return result;
    }
}
