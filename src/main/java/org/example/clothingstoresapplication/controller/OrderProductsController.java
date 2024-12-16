package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderProduct;
import org.example.clothingstoresapplication.repository.OrderProductRepository;
import org.example.clothingstoresapplication.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderProducts")
public class OrderProductsController {
    private OrderProductRepository orderProductRepository;

    @Autowired
    public  OrderProductsController(OrderProductRepository orderProductRepository) {
        this.orderProductRepository = orderProductRepository;
    }

    @GetMapping
    public Iterable<OrderProduct> getOrderProducts() {
        return orderProductRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public OrderProduct getOrderProductById(@PathVariable("id") int id){
        return orderProductRepository.findById(id).orElse(null);
    }

    @PostMapping
    public OrderProduct addOrder(@RequestBody OrderProduct orderProduct) {
        return orderProductRepository.save(orderProduct);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<OrderProduct> orderProducts) {
        orderProductRepository.saveAll(orderProducts);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        orderProductRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderProduct(@PathVariable("id") int id){
        orderProductRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<OrderProduct> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"orderProductId");
        return orderProductRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByProductId/{type}")
    public Iterable<OrderProduct> getCategoriesByProductId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"productId");
        return orderProductRepository.findAllOrderByProductId(pageable(sort));
    }

    @GetMapping("orderByOrderId/{type}")
    public Iterable<OrderProduct> getCategoriesByOrderId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"orderId");
        return orderProductRepository.findAllOrderByOrderId(pageable(sort));
    }

    @GetMapping("orderByCount/{type}")
    public Iterable<OrderProduct> getCategoriesByCount(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"count");
        return orderProductRepository.findAllOrderByCount(pageable(sort));
    }
}