package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.entity.Employee;
import org.example.clothingstoresapplication.repository.CustomersRepository;
import org.example.clothingstoresapplication.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@Transactional
public class EmployeesController {
    private EmployeeRepository employeeRepository;

    @Autowired
    public EmployeesController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public Iterable<Employee> getEmployees() {
        return employeeRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable("id") int id){
        return employeeRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeRepository.save(employee);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<Employee> employees) {
        employeeRepository.saveAll(employees);
    }

    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        employeeRepository.deleteAllById(ids);
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

    @GetMapping("/findBy")
    public Iterable<Employee> getEmployeesBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");

        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);

        return switch (findBy) {
            case "employeeId" -> employeeRepository.findAll(pageable(sort));
            case "firstName" -> employeeRepository.findAllByFirstNameLikeIgnoreCase(findValue + "%", pageable(sort));
            case "lastName" -> employeeRepository.findAllByLastNameLikeIgnoreCase(findValue + "%", pageable(sort));
            case "email" -> employeeRepository.findAllByEmailLikeIgnoreCase(findValue + "%", pageable(sort));
            case "storeId" -> employeeRepository.findAllByStoreId(Integer.parseInt(findValue), pageable(sort));
            case "position" -> employeeRepository.findAllByPositionLikeIgnoreCase(findValue + "%", pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
    }
}