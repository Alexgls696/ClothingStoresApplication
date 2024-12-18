package org.example.clothingstoresapplication.repository.stored_views;

import org.example.clothingstoresapplication.entity.stored_views.CustomerAndHisProduct;
import org.example.clothingstoresapplication.entity.stored_views.CustomersAndCountProductsView;
import org.example.clothingstoresapplication.entity.stored_views.StoresAndEmployeesCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoredViewsRepository extends JpaRepository<CustomersAndCountProductsView, Integer> {
    @Query("from CustomersAndCountProductsView ")
    List<CustomersAndCountProductsView>getCustomersAndCountProducts();

    @Query("from StoresAndEmployeesCount ")
    List<StoresAndEmployeesCount>getStoresAndEmployeesCount();

    @Query("from CustomerAndHisProduct ")
    List<CustomerAndHisProduct>getCustomerAndHisProduct();
}
/*
public class StoredViewsRepository {

    private LocalContainerEntityManagerFactoryBean entityManagerFactory;

    @Autowired
    public StoredViewsRepository(LocalContainerEntityManagerFactoryBean entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public Session session(){
        return entityManagerFactory.getObject().createEntityManager().unwrap(Session.class);
    }

    public List<CustomersAndCountProductsView>getEmployersAndCountProducts(){
        Session session = session();
        Query query = session.createQuery("from CustomersAndCountProductsView", CustomersAndCountProductsView.class);
        return query.getResultList();
    }

    public List<StoresAndEmployeesCount>getStoresAndEmployeesCount(){
        Session session = session();
        Query query = session.createQuery("from StoresAndEmployeesCount", StoresAndEmployeesCount.class);
        return query.getResultList();
    }

    public List<CustomerAndHisProduct>getCustomerAndHisProduct(){
        Session session = session();
        Query query = session.createQuery("from CustomerAndHisProduct", CustomerAndHisProduct.class);
        return query.getResultList();
    }
}
*/
