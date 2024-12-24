package org.example.clothingstoresapplication.entity.errors_logging;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

@Entity
@Table(name = "log_table",schema = "public")
@NoArgsConstructor
@Getter
@Setter
@ToString
public class LogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String log;
    @Column(name = "log_time")
    private Timestamp time;
}
