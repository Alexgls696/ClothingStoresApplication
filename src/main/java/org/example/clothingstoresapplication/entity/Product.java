package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "products",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int productId;
  private String productName;
  private String price;
  private Integer categoryId;
  private Integer typeId;
  private Integer supplierId;
}
