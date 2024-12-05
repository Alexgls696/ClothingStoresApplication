package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.entity.Order;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderRepositoryImpl implements OrderRepository {
    private DatabaseService databaseService;

    @Autowired
    public OrderRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<Order> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var orders = session.createQuery("from Order ", Order.class).getResultList();
        session.getTransaction().commit();
        return orders;
    }

    @Override
    public Order findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var order = session.get(Order.class, id);
        session.getTransaction().commit();
        return order;
    }

    @Override
    public Order save(Order order) {
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
        var order = session.get(Order.class, id);
        if(order != null) {
            session.remove(order);
        }
    }
}
