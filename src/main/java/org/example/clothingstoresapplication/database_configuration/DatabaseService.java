package org.example.clothingstoresapplication.database_configuration;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import lombok.Getter;
import org.apache.commons.dbcp2.BasicDataSource;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Environment;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLTimeoutException;
import java.sql.Statement;
import java.util.Properties;

@Getter
@Service
public class DatabaseService {
    private DataSource dataSource;
    private SessionFactory sessionFactory;

    public void configureDatabase(DatabaseCredentials credentials) throws Exception {
        this.dataSource = createDataSource(credentials);
        this.sessionFactory = createSessionFactory(this.dataSource);
    }

    private DataSource createDataSource(DatabaseCredentials credentials) throws SQLTimeoutException {
         BasicDataSource dataSource = new BasicDataSource();
        try{
            dataSource.setDriverClassName("org.postgresql.Driver");
            dataSource.setUrl(credentials.getUrl());
            dataSource.setUsername(credentials.getUsername());
            dataSource.setPassword(credentials.getPassword());

            Connection connection = dataSource.getConnection();
            Statement statement = connection.createStatement();
            statement.executeQuery("select 1");
            statement.close();
            connection.close();
        }catch (SQLException e){
            if(sessionFactory!=null){
                Session currentSession = sessionFactory.getCurrentSession();
                if (currentSession != null && currentSession.isOpen()) {
                    currentSession.close();
                }
                sessionFactory.close();
            }
            throw new SQLTimeoutException("Не удалось установить соединение");
        }
        return dataSource;
    }

    private SessionFactory createSessionFactory(DataSource dataSource) throws Exception {
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