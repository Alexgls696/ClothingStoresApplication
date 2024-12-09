package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "orders",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "order_id")
  private int orderId;
  @DateTimeFormat
  @Column(name = "order_date")
  private java.sql.Date orderDate;
  @Column(name = "store_id")
  private Integer storeId;
  @Column(name = "status_id")
  private Integer statusId;
}
