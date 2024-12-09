package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Product;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepositoryImpl implements ProductRepository {
    private DatabaseService databaseService;

    @Autowired
    public ProductRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<Product> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var orderStatuses = session.createQuery("from Product ", Product.class).getResultList();
        session.getTransaction().commit();
        return orderStatuses;
    }

    @Override
    public Product findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var product = session.get(Product.class, id);
        session.getTransaction().commit();
        return product;
    }

    @Override
    public Product save(Product order) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var added = session.merge(order);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var order = session.get(Product.class, id);
        if(order != null) {
            session.remove(order);
        }
    }
}
