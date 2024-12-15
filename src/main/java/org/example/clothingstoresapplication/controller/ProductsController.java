package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.entity.Product;
import org.example.clothingstoresapplication.repository.OrderStatusRepository;
import org.example.clothingstoresapplication.repository.ProductRepository;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductsController {
    private ProductRepository productRepository;

    @Autowired
    public  ProductsController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Autowired
    private LocalContainerEntityManagerFactoryBean entityManagerFactory;

    @GetMapping
    public Iterable<Product> getProducts() {
        try {
            System.out.println(entityManagerFactory.getDataSource().getConnection().getMetaData().getUserName());
        }catch (Exception e) {
            e.printStackTrace();
        }
        var saved = productRepository.save(new Product("Название3", 124.0,1,1,1));
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable("id") int id){
        return productRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable("id") int id){
        productRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Product> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"productId");
        return productRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByProductName/{type}")
    public Iterable<Product> getCategoriesByProductName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"productName");
        return productRepository.findAllOrderByName(pageable(sort));
    }

    @GetMapping("orderByPrice/{type}")
    public Iterable<Product> getCategoriesByPrice(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"price");
        return productRepository.findAllOrderByPrice(pageable(sort));
    }

    @GetMapping("orderByCategoryId/{type}")
    public Iterable<Product> getCategoriesByCategoryId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"categoryId");
        return productRepository.findAllOrderByCategoryId(pageable(sort));
    }

    @GetMapping("orderByTypeId/{type}")
    public Iterable<Product> getCategoriesByTypeId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"typeId");
        return productRepository.findAllOrderByTypeId(pageable(sort));
    }

    @GetMapping("orderBySupplierId/{type}")
    public Iterable<Product> getCategoriesBySupplierId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"supplierId");
        return productRepository.findAllOrderBySupplierId(pageable(sort));
    }
}