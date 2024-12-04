package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Category;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoriesRepositoryImpl implements CategoriesRepository {

    private DatabaseService databaseService;

    @Autowired
    public CategoriesRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }


    @Override
    public List<Category> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        List<Category> categories = session.createQuery("from Category", Category.class).getResultList();
        session.getTransaction().commit();
        return categories;
    }

    @Override
    public Category findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        Category category = session.get(Category.class, id);
        String currentUser  = (String) session.createNativeQuery("SELECT CURRENT_USER").getSingleResult();
        session.getTransaction().commit();
        return category;
    }

    @Override
    public Category save(Category category) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        Category added = session.merge(category);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public Category update(Category category) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        Category added = session.merge(category);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        Category category = session.get(Category.class, id);
        if(category != null) {
            session.delete(category);
        }
        session.getTransaction().commit();
    }

}
