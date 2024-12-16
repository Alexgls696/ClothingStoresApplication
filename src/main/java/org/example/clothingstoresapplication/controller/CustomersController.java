package org.example.clothingstoresapplication.controller;


import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.repository.CustomersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomersController {
    private CustomersRepository customersRepository;

    @Autowired
    public CustomersController(CustomersRepository customersRepository) {
        this.customersRepository = customersRepository;
    }

    @GetMapping
    public Iterable<Customer> getCustomers() {
        return customersRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable("id") int id){
        return customersRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Customer addCustomer(@RequestBody Customer customer) {
        return customersRepository.save(customer);
    }

    @PostMapping("/updateAll")
    public void updateCustomer(@RequestBody List<Customer>customers) {
        customersRepository.saveAll(customers);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        customersRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable("id") int id){
        customersRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Customer> getCustomersById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"customerId");
        return customersRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByFirstName/{type}")
    public Iterable<Customer> getCustomersByFirstName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"firstName");
        return customersRepository.findAllOrderByFirstName(pageable(sort));
    }

    @GetMapping("orderByLastName/{type}")
    public Iterable<Customer> getCustomersByLastName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"lastName");
        return customersRepository.findAllOrderByLastName(pageable(sort));
    }

    @GetMapping("orderByEmail/{type}")
    public Iterable<Customer> getCustomersByEmail(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"email");
        return customersRepository.findAllOrderByEmail(pageable(sort));
    }

    @GetMapping("orderByPhoneNumber/{type}")
    public Iterable<Customer> getCustomersByPhoneNumber(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"phoneNumber");
        return customersRepository.findAllOrderByPhoneNumber(pageable(sort));
    }

    @GetMapping("orderByOrderId/{type}")
    public Iterable<Customer> getCustomersByOrderId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"orderId");
        return customersRepository.findAllOrderByIdOrderId(pageable(sort));
    }
}
