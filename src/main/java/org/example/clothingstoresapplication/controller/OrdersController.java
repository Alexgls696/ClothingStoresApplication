package org.example.clothingstoresapplication.controller;

import org.aspectj.weaver.ast.Or;
import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    private OrderRepository orderRepository;

    @Autowired
    public OrdersController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public Iterable<Order> getOrders() {
        return orderRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable("id") int id){
        return orderRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Order addOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<Order> orders){
        orderRepository.saveAll(orders);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        orderRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable("id") int id){
        orderRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Order> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"orderId");
        return orderRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByDate/{type}")
    public Iterable<Order> getCategoriesByOrderDate(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"orderDate");
        return orderRepository.findAllOrderByOrderDate(pageable(sort));
    }

    @GetMapping("orderByStoreId/{type}")
    public Iterable<Order> getCategoriesByStoreId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"storeId");
        return orderRepository.findAllOrderByStoreId(pageable(sort));
    }

    @GetMapping("orderByStatusId/{type}")
    public Iterable<Order> getCategoriesByStatusId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"statusId");
        return orderRepository.findAllOrderByStatusId(pageable(sort));
    }
}