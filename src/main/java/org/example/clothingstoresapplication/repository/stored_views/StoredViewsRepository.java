package org.example.clothingstoresapplication.repository.stored_views;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Query;
import org.example.clothingstoresapplication.entity.stored_views.CustomerAndHisProduct;
import org.example.clothingstoresapplication.entity.stored_views.CustomersAndCountProductsView;
import org.example.clothingstoresapplication.entity.stored_views.StoresAndEmployeesCount;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class StoredViewsRepository {

    private LocalContainerEntityManagerFactoryBean entityManagerFactory;

    @Autowired
    public StoredViewsRepository(LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public Session session(){
        return entityManagerFactory.getObject().createEntityManager().unwrap(Session.class);
    }

    @Transactional
    public List<CustomersAndCountProductsView>getEmployersAndCountProducts(){
        Session session = session();
        Query query = session.createQuery("from CustomersAndCountProductsView", CustomersAndCountProductsView.class);
        return query.getResultList();
    }

    @Transactional
    public List<StoresAndEmployeesCount>getStoresAndEmployeesCount(){
        Session session = session();
        Query query = session.createQuery("from StoresAndEmployeesCount", StoresAndEmployeesCount.class);
        return query.getResultList();
    }

    @Transactional
    public List<CustomerAndHisProduct>getCustomerAndHisProduct(){
        Session session = session();
        Query query = session.createQuery("from CustomerAndHisProduct", CustomerAndHisProduct.class);
        return query.getResultList();
    }
}
