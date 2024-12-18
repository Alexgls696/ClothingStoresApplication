package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.OrderStatus;
import org.example.clothingstoresapplication.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orderStatuses")
@Transactional
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

    @GetMapping("/findBy")
    public Iterable<OrderStatus> getOrderStatusesBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");

        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);

        return switch (findBy) {
            case "id" -> orderStatusRepository.findAll(pageable(sort));
            case "statusName" -> orderStatusRepository.findAllByNameLikeIgnoreCase(findValue+"%", pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
    }
}