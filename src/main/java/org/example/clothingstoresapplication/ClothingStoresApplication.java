package org.example.clothingstoresapplication;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.example.clothingstoresapplication.repository.CategoriesRepository;
import org.example.clothingstoresapplication.repository.CategoriesRepositoryImpl;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.io.IOException;

@SpringBootApplication(exclude = {HibernateJpaAutoConfiguration.class, DataSourceAutoConfiguration.class})
public class ClothingStoresApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClothingStoresApplication.class, args);
    }

    private LocalSessionFactoryBean sessionFactory;

    /*@Bean
    public DataSource dataSource(){
        String url = "jdbc:postgresql://localhost:5432/clothing_stores?useSSL=false&serverTimezone=UTC";
        ComboPooledDataSource dataSource = null;
        try{
            dataSource = new ComboPooledDataSource();
            dataSource.setDriverClass("org.postgresql.Driver");
            dataSource.setJdbcUrl(url);
            dataSource.setUser("postgres");
            dataSource.setPassword("admin");
        }catch (PropertyVetoException e){
            throw new RuntimeException(e);
        }
        return dataSource;
    }

    @Bean("entityManagerFactory")
    public LocalSessionFactoryBean sessionFactory()  {
        sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(dataSource());
        sessionFactory.setPackagesToScan("org.example.clothingstoresapplication");
        return sessionFactory;
    }

    public void updateSessionFactory(DataSource newDataSource) throws IOException {
        // Закрытие текущего SessionFactory, если он существует
        if (sessionFactory != null) {
            sessionFactory.destroy(); // Закрытие текущего SessionFactory
        }
        // Создание нового SessionFactory с новыми данными
        sessionFactory = new LocalSessionFactoryBean();
        sessionFactory.setDataSource(newDataSource);
        sessionFactory.setPackagesToScan("org.example.clothingstoresapplication");
        sessionFactory.afterPropertiesSet();
    }*/
}
