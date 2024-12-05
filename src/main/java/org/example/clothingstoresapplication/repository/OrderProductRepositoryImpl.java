package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Order;
import org.example.clothingstoresapplication.entity.OrderProduct;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OrderProductRepositoryImpl implements OrderProductRepository {

    private DatabaseService databaseService;

    @Autowired
    public OrderProductRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }


    @Override
    public List<OrderProduct> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var orderProducts = session.createQuery("from OrderProduct ", OrderProduct.class).getResultList();
        session.getTransaction().commit();
        return orderProducts;
    }

    @Override
    public OrderProduct findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var orderProduct = session.get(OrderProduct.class, id);
        session.getTransaction().commit();
        return orderProduct;
    }

    @Override
    public OrderProduct save(OrderProduct order) {
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
        var orderProduct = session.get(OrderProduct.class, id);
        if(orderProduct != null) {
            session.remove(orderProduct);
        }
    }
}
