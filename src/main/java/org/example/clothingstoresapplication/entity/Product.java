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
  private int id;

  @Column(name = "product_name")
  private String name;
  private Double price;

  @JoinColumn(name="category_id")
  @OneToOne(fetch = FetchType.EAGER)
  private Category category;

  @JoinColumn(name = "type_id")
  @OneToOne(fetch = FetchType.EAGER)
  private ProductsType type;

  @JoinColumn(name = "supplier_id")
  @OneToOne(fetch = FetchType.EAGER)
  private Supplier supplier;


  public Product(String name, Double price, Category category, ProductsType type, Supplier supplier) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.type = type;
    this.supplier = supplier;
  }
}
