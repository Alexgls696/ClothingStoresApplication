package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderProduct;
import org.example.clothingstoresapplication.repository.OrderProductRepository;
import org.example.clothingstoresapplication.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        return orderProductRepository.findAll();
    }

    @GetMapping("/{id}")
    public OrderProduct getOrderProductById(@PathVariable("id") int id){
        return orderProductRepository.findById(id).orElse(null);
    }

    @PostMapping
    public OrderProduct addOrder(@RequestBody OrderProduct orderProduct) {
        return orderProductRepository.save(orderProduct);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderProduct(@PathVariable("id") int id){
        orderProductRepository.deleteById(id);
    }
}