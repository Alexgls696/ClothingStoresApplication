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
import java.util.Map;

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
        return productRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable("id") int id){
        return productRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<Product> products) {
        productRepository.saveAll(products);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        productRepository.deleteAllById(ids);
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

    @GetMapping("/findBy")
    public Iterable<Product> getProductsBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");

        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);

        return switch (findBy) {
            case "productId" -> productRepository.findAll(pageable(sort));
            case "productName" -> productRepository.findAllByProductNameLikeIgnoreCase(findValue+"%", pageable(sort));
            case "categoryId" -> productRepository.findAllByCategoryId(Integer.parseInt(findValue), pageable(sort));
            case "typeId" -> productRepository.findAllByTypeId(Integer.parseInt(findValue), pageable(sort));
            case "supplierId" -> productRepository.findAllBySupplierId(Integer.parseInt(findValue), pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
    }

}