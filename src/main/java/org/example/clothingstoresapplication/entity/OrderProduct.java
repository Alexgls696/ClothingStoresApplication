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
  private Integer orderProductsId;
  private Integer productId;
  private Integer orderId;
  private Integer count;
}
