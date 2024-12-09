package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Store;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StoreRepositoryImpl implements StoreRepository {
    private DatabaseService databaseService;

    @Autowired
    public StoreRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<Store> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var store = session.createQuery("from Store ", Store.class).getResultList();
        session.getTransaction().commit();
        return store;
    }

    @Override
    public Store findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var store = session.get(Store.class, id);
        session.getTransaction().commit();
        return store;
    }

    @Override
    public Store save(Store store) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var added = session.merge(store);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var order = session.get(Store.class, id);
        if(order != null) {
            session.remove(order);
        }
    }
}
