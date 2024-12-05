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

}
