package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface StoreRepository extends CrudRepository<Store, Integer> {
    Page<Store> findAll(Pageable pageable);

    @Query(value = "from Store ")
    Page<Store> findAllOrderById(Pageable pageable);

    @Query(value = "from Store ")
    Page<Store> findAllOrderByLocation(Pageable pageable);

    Page<Store>findAllByStoreId(Integer storeId, Pageable pageable);
    Page<Store>findAllByLocationLikeIgnoreCase( String location, Pageable pageable);
}
