package org.example.clothingstoresapplication.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "products_types",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class ProductsType {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer typeId;
  private String typeName;
}
