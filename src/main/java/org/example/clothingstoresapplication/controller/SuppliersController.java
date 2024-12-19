package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Supplier;
import org.example.clothingstoresapplication.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suppliers")
@Transactional
public class SuppliersController {
    private SupplierRepository supplierRepository;

    @Autowired
    public SuppliersController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public Iterable<Supplier> getSuppliers() {
        return supplierRepository.findAll(Pageable.unpaged());
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable("id") int id){
        return supplierRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @PostMapping("/updateAll")
    public void updateAll(@RequestBody List<Supplier> suppliers){
        supplierRepository.saveAll(suppliers);
    }
    @PostMapping("/deleteAll")
    public void deleteAll(@RequestBody List<Integer>ids){
        supplierRepository.deleteAllById(ids);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable("id") int id){
        supplierRepository.deleteById(id);
    }

    private Pageable pageable(Sort sort){
        return Pageable.unpaged(sort);
    }

    @GetMapping("orderById/{type}")
    public Iterable<Supplier> getCategoriesById(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"supplierId");
        return supplierRepository.findAllOrderById(pageable(sort));
    }

    @GetMapping("orderBySupplierName/{type}")
    public Iterable<Supplier> getCategoriesBySupplierName(@PathVariable("type") String type){
        Sort sort = Sort.by(type.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,"supplierName");
        return supplierRepository.findAllOrderBySupplierName(pageable(sort));
    }

    @GetMapping("/findBy")
    public Iterable<Supplier> getSuppliersBy(@RequestParam Map<String, String> parameters) {
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        String findBy = parameters.get("findBy");
        String findValue = parameters.get("findValue");
        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        return switch (findBy) {
            case "id" -> supplierRepository.findAll(pageable(sort));
            case "name" -> supplierRepository.findAllByNameLikeIgnoreCase(findValue+"%", pageable(sort));
            default -> throw new IllegalStateException("Unexpected value: " + findBy);
        };
    }
}