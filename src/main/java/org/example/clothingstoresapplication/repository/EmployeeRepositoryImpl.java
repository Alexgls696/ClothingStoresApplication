package org.example.clothingstoresapplication.repository;

import org.example.clothingstoresapplication.database_configuration.DatabaseService;
import org.example.clothingstoresapplication.entity.Customer;
import org.example.clothingstoresapplication.entity.Employee;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EmployeeRepositoryImpl implements EmployeeRepository {
    private DatabaseService databaseService;

    @Autowired
    public EmployeeRepositoryImpl(DatabaseService service) {
        this.databaseService = service;
    }

    @Override
    public List<Employee> findAll() {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var employees = session.createQuery("from Employee ", Employee.class).getResultList();
        session.getTransaction().commit();
        return employees;
    }

    @Override
    public Employee findById(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var employee = session.get(Employee.class, id);
        session.getTransaction().commit();
        return employee;
    }

    @Override
    public Employee save(Employee employee) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var added = session.merge(employee);
        session.getTransaction().commit();
        return added;
    }

    @Override
    public void delete(int id) {
        Session session = databaseService.getSessionFactory().getCurrentSession();
        session.beginTransaction();
        var employee = session.get(Employee.class, id);
        if(employee != null) {
            session.remove(employee);
        }
    }
}
