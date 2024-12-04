package org.example.clothingstoresapplication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "employees", schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Employee {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int employeeId;
  private String firstName;
  private String lastName;
  private Integer storeId;
  private String position;
  private String email;
}
