package org.example.clothingstoresapplication.entity.errors;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "errors", schema = "public")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Error {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String error;
    @Column(name = "error_date")
    private Timestamp timestamp;

    public Error(String error, Date date) {
        this.error = error;
        this.timestamp = new Timestamp(date.getTime());
    }
}
