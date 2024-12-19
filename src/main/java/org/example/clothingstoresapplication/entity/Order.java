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
  private int id;
  @DateTimeFormat
  @Column(name = "order_date")
  private java.sql.Date date;

  @JoinColumn(name = "store_id")
  @OneToOne(fetch = FetchType.EAGER)
  private Store store;

  @JoinColumn(name = "status_id")
  @OneToOne(fetch = FetchType.EAGER)
  private OrderStatus status;

}
