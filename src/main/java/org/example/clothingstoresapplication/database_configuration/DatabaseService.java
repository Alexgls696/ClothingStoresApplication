package org.example.clothingstoresapplication.database_configuration;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import lombok.Getter;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.io.IOException;
import java.util.Properties;

@Service
@EnableTransactionManagement
@Getter
public class DatabaseService {
    private DataSource dataSource;
    private SessionFactory sessionFactory;


    public void configureDatabase(DatabaseCredentials credentials) throws Exception {
        this.dataSource = createDataSource(credentials);
        this.sessionFactory = createSessionFactory(this.dataSource);
    }

    private DataSource createDataSource(DatabaseCredentials credentials) {
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        try{
            dataSource.setDriverClass("org.postgresql.Driver");
            dataSource.setJdbcUrl(credentials.getUrl());
            dataSource.setUser(credentials.getUsername());
            dataSource.setPassword(credentials.getPassword());
        }catch (PropertyVetoException e){
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
        return dataSource;
    }

    private SessionFactory createSessionFactory(DataSource dataSource) throws IOException {
        if (sessionFactory != null) {
            Session currentSession = sessionFactory.getCurrentSession();
            if (currentSession != null && currentSession.isOpen()) {
                currentSession.close();
            }
        }
        LocalSessionFactoryBean sessionFactoryBean = new LocalSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);
        sessionFactoryBean.setPackagesToScan("org.example.clothingstoresapplication.entity");

        Properties hibernateProperties = new Properties();
        hibernateProperties.put(Environment.DIALECT, "org.hibernate.dialect.PostgreSQLDialect");
        hibernateProperties.put(Environment.SHOW_SQL, true);
        hibernateProperties.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");
        sessionFactoryBean.setHibernateProperties(hibernateProperties);

        sessionFactoryBean.afterPropertiesSet(); // Инициализация SessionFactory
        return sessionFactoryBean.getObject();
    }

}