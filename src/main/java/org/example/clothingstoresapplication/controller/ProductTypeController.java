package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.entity.ProductsType;
import org.example.clothingstoresapplication.repository.OrderStatusRepository;
import org.example.clothingstoresapplication.repository.ProductsTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productTypes")
public class ProductTypeController {
    private ProductsTypeRepository productsTypeRepository;

    @Autowired
    public ProductTypeController(ProductsTypeRepository productsTypeRepository) {
        this.productsTypeRepository = productsTypeRepository;
    }

    @GetMapping
    public Iterable<ProductsType> getProductsTypes() {
        return productsTypeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ProductsType getProductsTypeById(@PathVariable("id") int id){
        return productsTypeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ProductsType addOrder(@RequestBody ProductsType productsType) {
        return productsTypeRepository.save(productsType);
    }

    @DeleteMapping("/{id}")
    public void deleteProductType(@PathVariable("id") int id){
        productsTypeRepository.deleteById(id);
    }
}