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
  @Column(name = "employee_id")
  private int id;

  @Column(name = "first_name")
  private String firstName;
  @Column(name = "last_name")
  private String lastName;

  @JoinColumn(name = "store_id")
  @OneToOne(fetch = FetchType.EAGER)
  private Store store;

  private String position;
  private String email;
}
