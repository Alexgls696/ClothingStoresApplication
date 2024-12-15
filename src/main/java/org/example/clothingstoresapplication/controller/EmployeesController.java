package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.entity.Employee;
import org.example.clothingstoresapplication.repository.CustomersRepository;
import org.example.clothingstoresapplication.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeesController {
    private EmployeeRepository employeeRepository;

    @Autowired
    public EmployeesController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public Iterable<Employee> getEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable("id") int id){
        return employeeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable("id") int id){
        employeeRepository.deleteById(id);
    }


    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Employee> getEmployeesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"employeeId");
        return employeeRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderByFirstName/{type}")
    public Iterable<Employee> getEmployeesByFirstName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"firstName");
        return employeeRepository.findAllOrderByFirstName(pageable(sort));
    }

    @GetMapping("orderByLastName/{type}")
    public Iterable<Employee> getEmployeesByLastName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"lastName");
        return employeeRepository.findAllOrderByLastName(pageable(sort));
    }

    @GetMapping("orderByStoreId/{type}")
    public Iterable<Employee> getEmployeesByStoreId(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"storeId");
        return employeeRepository.findAllOrderByStoreId(pageable(sort));
    }

    @GetMapping("orderByPosition/{type}")
    public Iterable<Employee> getEmployeesByPosition(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"position");
        return employeeRepository.findAllOrderByPosition(pageable(sort));
    }

    @GetMapping("orderByEmail/{type}")
    public Iterable<Employee> getEmployeesByEmail(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"email");
        return employeeRepository.findAllOrderByEmail(pageable(sort));
    }

}