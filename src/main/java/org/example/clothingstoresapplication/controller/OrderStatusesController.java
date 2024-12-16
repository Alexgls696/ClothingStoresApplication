package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
        return orderStatusRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public OrderStatus getOrderStatusById(@PathVariable("id") int id){
        return orderStatusRepository.findById(id).orElse(null);
    }

    @PostMapping
    public OrderStatus addOrder(@RequestBody OrderStatus orderStatus) {
        return orderStatusRepository.save(orderStatus);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<OrderStatus> orderStatuses) {
        orderStatusRepository.saveAll(orderStatuses);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        orderStatusRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderStatus(@PathVariable("id") int id){
        orderStatusRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<OrderStatus> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"statusId");
        return orderStatusRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByStatusName/{type}")
    public Iterable<OrderStatus> getCategoriesByName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"statusName");
        return orderStatusRepository.findAllOrderByName(pageable(sort));
    }
}