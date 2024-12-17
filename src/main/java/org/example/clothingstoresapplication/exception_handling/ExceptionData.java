package org.example.clothingstoresapplication.exception_handling;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExceptionData {
    private String message;
    private boolean success = false;
}
