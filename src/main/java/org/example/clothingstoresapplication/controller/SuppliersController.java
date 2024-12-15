package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.Supplier;
import org.example.clothingstoresapplication.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suppliers")
public class SuppliersController {
    private SupplierRepository supplierRepository;

    @Autowired
    public SuppliersController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public Iterable<Supplier> getSuppliers() {
        return supplierRepository.findAll();
    }

    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable("id") int id){
        return supplierRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
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
        return supplierRepository.findAllOrderById(pageable(sort));
    }
}