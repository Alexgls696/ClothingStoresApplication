package org.example.clothingstoresapplication.entity.stored_views;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "get_customers_and_their_products",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class CustomerAndHisProduct {
    @Id
    @Column(name = "customer_id")
    private int id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "order_id")
    private int orderId;

    @Column(name = "product_id")
    private int productId;

    @Column(name = "product_name")
    private String productName;
}
