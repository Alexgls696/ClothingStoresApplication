package org.example.clothingstoresapplication.entity.stored_views;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "get_customers_and_count_products",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
public class CustomersAndCountProductsView {
    @Id
    private int id;
    private String first_name;
    private String last_name;
    private int count;
}
