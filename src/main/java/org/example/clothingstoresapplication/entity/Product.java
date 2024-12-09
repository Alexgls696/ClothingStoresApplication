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
  @Column(name = "product_id")
  private int productId;
  @Column(name = "product_name")
  private String productName;
  private String price;
  @Column(name="category_id")
  private Integer categoryId;
  @Column(name = "type_id")
  private Integer typeId;
  @Column(name = "supplier_id")
  private Integer supplierId;
}
