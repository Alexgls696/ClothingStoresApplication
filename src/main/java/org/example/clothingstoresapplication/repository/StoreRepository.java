package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.entity.Product;
import org.example.clothingstoresapplication.entity.Store;

import java.util.List;

public interface StoreRepository {
    List<Store> findAll();
    Store findById(int id);
    Store save(Store store);
    void delete(int id);
}
