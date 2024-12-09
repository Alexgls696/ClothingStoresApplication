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
  private Integer orderProductId;
  @Column(name = "product_id")
  private Integer productId;
  @Column(name = "order_id")
  private Integer orderId;
  private Integer count;
}
