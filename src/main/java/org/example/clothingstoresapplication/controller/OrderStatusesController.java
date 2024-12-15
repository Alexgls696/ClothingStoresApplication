package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderStatuses")
public class OrderStatusesController {
    private OrderStatusRepository orderStatusRepository;

    @Autowired
    public  OrderStatusesController(OrderStatusRepository orderStatusRepository) {
        this.orderStatusRepository = orderStatusRepository;
    }

    @GetMapping
    public Iterable<OrderStatus> getOrderStatuses() {
        return orderStatusRepository.findAll();
    }

    @GetMapping("/{id}")
    public OrderStatus getOrderStatusById(@PathVariable("id") int id){
        return orderStatusRepository.findById(id).orElse(null);
    }

    @PostMapping
    public OrderStatus addOrder(@RequestBody OrderStatus orderStatus) {
        return orderStatusRepository.save(orderStatus);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderStatus(@PathVariable("id") int id){
        orderStatusRepository.deleteById(id);
    }
}