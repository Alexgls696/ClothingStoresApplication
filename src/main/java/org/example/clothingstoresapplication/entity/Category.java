package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Category {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  private long id;

  @Column(name = "category_name")
  private String name;
}
