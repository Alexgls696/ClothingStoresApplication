package org.example.clothingstoresapplication.exception_handling;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLTimeoutException;

@RestControllerAdvice
public class GlobalExceptionHandling {

    @ExceptionHandler
    public ResponseEntity<ExceptionData>exceptionHandler(SQLTimeoutException exception){
        ExceptionData exceptionData = new ExceptionData();
        exceptionData.setMessage(exception.getMessage());
        return new ResponseEntity<>(exceptionData, HttpStatus.REQUEST_TIMEOUT);
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionData>exceptionHandler(IllegalStateException exception){
        ExceptionData exceptionData = new ExceptionData();
        exceptionData.setMessage("Сессия была закрыта");
        return new ResponseEntity<>(exceptionData, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
