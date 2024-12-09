package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Supplier;

import java.util.List;

public interface SupplierRepository {
    List<Supplier> findAll();
    Supplier findById(int id);
    Supplier save(Supplier supplier);
    void delete(int id);
}
