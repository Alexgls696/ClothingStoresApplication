package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderStatus;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderStatusRepositoryImpl implements OrderStatusRepository {
    private DatabaseService databaseService;

    @Autowired
    public OrderStatusRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<OrderStatus> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var orderStatuses = session.createQuery("from OrderStatus ", OrderStatus.class).getResultList();
        session.getTransaction().commit();
        return orderStatuses;
    }

    @Override
    public OrderStatus findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var orderStatus = session.get(OrderStatus.class, id);
        session.getTransaction().commit();
        return orderStatus;
    }

    @Override
    public OrderStatus save(OrderStatus order) {
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
        var order = session.get(OrderStatus.class, id);
        if(order != null) {
            session.remove(order);
        }
    }
}
