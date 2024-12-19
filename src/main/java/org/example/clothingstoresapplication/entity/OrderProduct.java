package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "order_products",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class OrderProduct {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_products_id")
  private Integer id;

  @JoinColumn(name = "product_id")
  @ManyToOne(fetch = FetchType.EAGER)
  private Product product;

  @JoinColumn(name = "order_id")
  @ManyToOne(fetch = FetchType.EAGER)
  private Order order;

  private Integer count;
}
