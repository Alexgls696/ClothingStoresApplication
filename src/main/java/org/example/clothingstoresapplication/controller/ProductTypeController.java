package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.ProductsType;
import org.example.clothingstoresapplication.repository.ProductsTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productTypes")
@Transactional
public class ProductTypeController {
    private ProductsTypeRepository productsTypeRepository;

    @Autowired
    public ProductTypeController(ProductsTypeRepository productsTypeRepository) {
        this.productsTypeRepository = productsTypeRepository;
    }

    @GetMapping
    public Iterable<ProductsType> getProductsTypes() {
        return productsTypeRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public ProductsType getProductsTypeById(@PathVariable("id") int id){
        return productsTypeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ProductsType addOrder(@RequestBody ProductsType productsType) {
        return productsTypeRepository.save(productsType);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<ProductsType> productsTypes){
        productsTypeRepository.saveAll(productsTypes);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        productsTypeRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteProductType(@PathVariable("id") int id){
        productsTypeRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<ProductsType> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"typeId");
        return productsTypeRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByTypeName/{type}")
    public Iterable<ProductsType> getCategoriesByTypeId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"typeName");
        return productsTypeRepository.findAllOrderByName(pageable(sort));
    }

    @GetMapping("/findBy")
    public Iterable<ProductsType> getProductsTypesBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");

        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);

        return switch (findBy) {
            case "id" -> productsTypeRepository.findAll(pageable(sort));
            case "name" -> productsTypeRepository.findAllByNameLikeIgnoreCase(findValue+"%", pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
    }
}