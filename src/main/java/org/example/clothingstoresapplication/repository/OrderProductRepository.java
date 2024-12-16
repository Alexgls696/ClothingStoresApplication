package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.OrderProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface OrderProductRepository extends CrudRepository<OrderProduct, Integer> {
    Page<OrderProduct> findAll(Pageable pageable);

    @Query(value = "from OrderProduct ")
    Page<OrderProduct> findAllOrderById(Pageable pageable);

    @Query(value = "from OrderProduct ")
    Page<OrderProduct> findAllOrderByProductId(Pageable pageable);

    @Query(value = "from OrderProduct ")
    Page<OrderProduct> findAllOrderByOrderId(Pageable pageable);

    @Query(value = "from OrderProduct ")
    Page<OrderProduct> findAllOrderByCount(Pageable pageable);
}
