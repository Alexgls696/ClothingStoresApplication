package org.example.clothingstoresapplication.entity.stored_views_and_functions;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "get_stores_and_employees_count",schema = "main_schema")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class StoresAndEmployeesCount {
    @Id
    private int id;
    private String location;
    private int count;
}
