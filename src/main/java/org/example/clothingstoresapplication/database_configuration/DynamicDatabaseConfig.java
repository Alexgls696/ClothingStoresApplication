
package org.example.clothingstoresapplication.database_configuration;

import jakarta.persistence.EntityManagerFactory;
import org.apache.commons.dbcp2.BasicDataSource;
import org.hibernate.cfg.Environment;
import org.hibernate.jpa.HibernatePersistenceProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Configuration
@EnableTransactionManagement
public class DynamicDatabaseConfig {

    private final Map<Object, Object> dataSources = new HashMap<>();

    public static String DEFAULT_USER = "_admin";
    public static String DEFAULT_PASSWORD = "12341234";

    @Bean
    public DynamicDataSource dynamicDataSource() {
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        dynamicDataSource.setTargetDataSources(dataSources);
        BasicDataSource defaultDataSource = new BasicDataSource();
        defaultDataSource.setDriverClassName("org.postgresql.Driver");
        defaultDataSource.setUrl("jdbc:postgresql://localhost:5432/clothing_stores?useSSL=false&serverTimezone=UTC");
        defaultDataSource.setUsername(DEFAULT_USER);
        defaultDataSource.setPassword(DEFAULT_PASSWORD);
        dynamicDataSource.setDefaultTargetDataSource(defaultDataSource);
        return dynamicDataSource;
    }



    public void addDataSource(String key, DatabaseCredentials credentials) throws SQLException {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl(credentials.getUrl());
        dataSource.setUsername(credentials.getUsername());
        dataSource.setPassword(credentials.getPassword());
        dataSource.setInitialSize(3);

        try (Connection connection = dataSource.getConnection()) {
            connection.createStatement().executeQuery("select 1");
        } catch (SQLException e) {
            throw new SQLException("Ошибка подключения: " + e.getMessage());
        }

        dataSources.put(key, dataSource);

        DynamicDataSource dynamicDataSource = dynamicDataSource();
        dynamicDataSource.setTargetDataSources(dataSources);
        dynamicDataSource.afterPropertiesSet();
    }

    public void reconfigureSessionFactoryAndTransactionManager(String key) {
        ApplicationContext context = ApplicationContextProvider.getApplicationContext();

        LocalContainerEntityManagerFactoryBean sessionFactoryBean = context.getBean(LocalContainerEntityManagerFactoryBean.class);
        sessionFactoryBean.setDataSource((DataSource) dataSources.get(key));
        sessionFactoryBean.afterPropertiesSet();

        JpaTransactionManager transactionManager = context.getBean(JpaTransactionManager.class);
        transactionManager.setEntityManagerFactory(sessionFactoryBean.getObject());
        transactionManager.setDataSource((DataSource) dataSources.get(key));
        transactionManager.afterPropertiesSet();
    }

    @Bean
    @Scope("prototype")
    public PlatformTransactionManager transactionManager(LocalContainerEntityManagerFactoryBean sessionFactory) {
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(sessionFactory.getObject());
        return transactionManager;
    }

    @Bean("entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean sessionFactory(DynamicDataSource dynamicDataSource) {
        LocalContainerEntityManagerFactoryBean sessionFactoryBean = new LocalContainerEntityManagerFactoryBean();
        sessionFactoryBean.setDataSource(dynamicDataSource);
        sessionFactoryBean.setPackagesToScan("org.example.clothingstoresapplication.entity");

        Properties hibernateProperties = new Properties();
        hibernateProperties.put(Environment.DIALECT, "org.hibernate.dialect.PostgreSQLDialect");
        hibernateProperties.put(Environment.SHOW_SQL, true);
        hibernateProperties.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");
        sessionFactoryBean.setJpaProperties(hibernateProperties);
        sessionFactoryBean.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        sessionFactoryBean.setPersistenceProviderClass(HibernatePersistenceProvider.class);

        return sessionFactoryBean;
    }


}
