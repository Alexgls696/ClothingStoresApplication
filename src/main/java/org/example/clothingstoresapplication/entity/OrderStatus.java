package org.example.clothingstoresapplication.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "order_statuses",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class OrderStatus {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "status_id")
  private Integer statusId;
  @Column(name = "status_name")
  private String statusName;
}
