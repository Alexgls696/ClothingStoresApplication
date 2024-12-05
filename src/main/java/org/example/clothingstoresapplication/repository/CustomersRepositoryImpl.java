package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Customer;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomersRepositoryImpl implements CustomersRepository{
    private DatabaseService databaseService;

    @Autowired
    public CustomersRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<Customer> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var customers = session.createQuery("from Customer", Customer.class).getResultList();
        session.getTransaction().commit();
        return customers;
    }

    @Override
    public Customer findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var customer = session.get(Customer.class, id);
        session.getTransaction().commit();
        return customer;
    }

    @Override
    public Customer save(Customer category) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var added = session.merge(category);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var customer = session.get(Customer.class, id);
        if(customer != null) {
            session.remove(customer);
        }
    }
}
