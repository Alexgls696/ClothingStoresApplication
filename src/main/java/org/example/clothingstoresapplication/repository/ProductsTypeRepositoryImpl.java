package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Product;
import org.example.clothingstoresapplication.entity.ProductsType;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductsTypeRepositoryImpl implements ProductsTypeRepository {
    private DatabaseService databaseService;

    @Autowired
    public ProductsTypeRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<ProductsType> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var productType = session.createQuery("from ProductsType ", ProductsType.class).getResultList();
        session.getTransaction().commit();
        return productType;
    }

    @Override
    public ProductsType findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var productType = session.get(ProductsType.class, id);
        session.getTransaction().commit();
        return productType;
    }

    @Override
    public ProductsType save(ProductsType productsType) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var added = session.merge(productsType);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var order = session.get(ProductsType.class, id);
        if(order != null) {
            session.remove(order);
        }
    }
}
