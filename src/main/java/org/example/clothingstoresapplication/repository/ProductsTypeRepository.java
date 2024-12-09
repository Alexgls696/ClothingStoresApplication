package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.ProductsType;
import java.util.List;

public interface ProductsTypeRepository {
    List<ProductsType> findAll();
    ProductsType findById(int id);
    ProductsType save(ProductsType productsType);
    void delete(int id);
}
