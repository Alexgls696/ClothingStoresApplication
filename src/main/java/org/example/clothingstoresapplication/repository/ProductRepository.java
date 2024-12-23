package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Category;
import org.example.clothingstoresapplication.entity.Product;
import org.example.clothingstoresapplication.entity.ProductsType;
import org.example.clothingstoresapplication.entity.Supplier;
import org.hibernate.type.descriptor.jdbc.NumericJdbcType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {
    @Modifying
    @Query(nativeQuery = true, value = "call main_schema.add_product(:name,cast(:price as numeric),:category," +
            ":type,:supplier)")
    void saveByParams(@Param("name") String name,
                          @Param("price") Double price,
                          @Param("category") int category,
                          @Param("type") int type,
                          @Param("supplier") int supplier);


    @Modifying
    @Query(nativeQuery = true,value = "call main_schema.update_product_by_id(:id,:name,cast(:price as numeric),:category,:type,:supplier)")
    void updateByParams(@Param("id") int id,
                            @Param("name") String name,
                            @Param("price") Double price,
                            @Param("category") int category,
                            @Param("type") int type,
                            @Param("supplier") int supplier);

    @Modifying
    @Query(nativeQuery = true, value = "call main_schema.add_product_and_supplier(:productName,cast(:price as numeric), " +
            ":category,:type,:supplier)")
    void addProductAndSupplier(@Param("productName") String productName,
                               @Param("price") Double price,
                               @Param("category") int category,
                               @Param("type")int type,
                               @Param("supplier") String supplier);

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

    Page<Product>findAllById(int productId, Pageable pageable);
    Page<Product>findAllByCategoryNameLikeIgnoreCase(String name, Pageable pageable);
    Page<Product>findAllByTypeNameLikeIgnoreCase(String name, Pageable pageable);
    Page<Product>findAllBySupplierNameLikeIgnoreCase(String name, Pageable pageable);
    Page<Product>findAllByNameLikeIgnoreCase(String productName, Pageable pageable);
    Page<Product>findAllByPrice(double price, Pageable pageable);

    @Query("from Product order by id desc limit 1")
    Product findLastProduct();
}
