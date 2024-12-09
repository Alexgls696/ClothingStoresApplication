package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Store;
import org.example.clothingstoresapplication.entity.Supplier;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupplierRepositoryImpl implements SupplierRepository {
    private DatabaseService databaseService;

    @Autowired
    public SupplierRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<Supplier> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var suppliers = session.createQuery("from Supplier ", Supplier.class).getResultList();
        session.getTransaction().commit();
        return suppliers;
    }

    @Override
    public Supplier findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var supplier = session.get(Supplier.class, id);
        session.getTransaction().commit();
        return supplier;
    }

    @Override
    public Supplier save(Supplier supplier) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var added = session.merge(supplier);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var order = session.get(Supplier.class, id);
        if(order != null) {
            session.remove(order);
        }
    }
}
