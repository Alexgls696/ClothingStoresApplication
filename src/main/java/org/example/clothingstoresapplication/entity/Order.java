package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "orders",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int orderId;
  private java.sql.Date orderDate;
  private Integer storeId;
  private Integer statusId;
}
