package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Product;
import org.example.clothingstoresapplication.entity.Supplier;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends CrudRepository<Supplier, Integer> {

}
