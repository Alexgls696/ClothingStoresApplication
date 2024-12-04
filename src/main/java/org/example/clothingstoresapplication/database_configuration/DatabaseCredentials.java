package org.example.clothingstoresapplication.database_configuration;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DatabaseCredentials {
    private String url = "jdbc:postgresql://localhost:5432/clothing_stores?useSSL=false&serverTimezone=UTC";
    private String username;
    private String password;
}
