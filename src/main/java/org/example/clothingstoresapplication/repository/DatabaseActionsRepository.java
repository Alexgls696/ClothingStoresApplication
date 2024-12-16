package org.example.clothingstoresapplication.repository;

import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DatabaseActionsRepository {

    @Autowired
    private LocalContainerEntityManagerFactoryBean entityManagerFactoryBean;

    public Session getSession(){
        return entityManagerFactoryBean.getObject().createEntityManager().unwrap(Session.class);
    }

    public String getUserRole(){
        Session session = getSession();
        String query = "SELECT rolname FROM pg_roles WHERE pg_has_role(current_user, oid, 'member')";
        NativeQuery<String> nativeQuery = session.createNativeQuery(query);
        List<String> roles = nativeQuery.getResultList();
        return roles.get(0);
    }
}
