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
  private Double price;
  @Column(name="category_id")
  private Integer categoryId;
  @Column(name = "type_id")
  private Integer typeId;
  @Column(name = "supplier_id")
  private Integer supplierId;

  public Product(String productName, Double price, Integer categoryId, Integer typeId, Integer supplierId) {
    this.productName = productName;
    this.price = price;
    this.categoryId = categoryId;
    this.typeId = typeId;
    this.supplierId = supplierId;
  }
}
