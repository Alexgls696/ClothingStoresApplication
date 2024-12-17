package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface ProductRepository extends CrudRepository<Product, Integer> {
    Page<Product> findAll(Pageable pageable);

    @Query(value = "from Product ")
    Page<Product> findAllOrderById(Pageable pageable);

    @Query(value = "from Product ")
    Page<Product> findAllOrderByName(Pageable pageable);

    @Query(value = "from Product ")
    Page<Product> findAllOrderByPrice(Pageable pageable);

    @Query(value = "from Product ")
    Page<Product> findAllOrderByCategoryId(Pageable pageable);

    @Query(value = "from Product ")
    Page<Product> findAllOrderByTypeId(Pageable pageable);

    @Query(value = "from Product ")
    Page<Product> findAllOrderBySupplierId(Pageable pageable);

    Page<Product>findAllByProductId(int productId, Pageable pageable);
    Page<Product>findAllByCategoryId(int categoryId, Pageable pageable);
    Page<Product>findAllByTypeId(int typeId, Pageable pageable);
    Page<Product>findAllBySupplierId(int supplierId, Pageable pageable);
    Page<Product>findAllByProductNameLikeIgnoreCase(String productName, Pageable pageable);
    Page<Product>findAllByPrice(double price, Pageable pageable);
}
