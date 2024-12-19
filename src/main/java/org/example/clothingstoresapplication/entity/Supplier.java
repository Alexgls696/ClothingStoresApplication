package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "suppliers",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Supplier {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "supplier_id")
  private Integer id;
  @Column(name = "supplier_name")
  private String name;
}
