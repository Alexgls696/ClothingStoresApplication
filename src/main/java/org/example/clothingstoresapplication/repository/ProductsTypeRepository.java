package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.ProductsType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsTypeRepository extends CrudRepository<ProductsType, Integer> {

}
