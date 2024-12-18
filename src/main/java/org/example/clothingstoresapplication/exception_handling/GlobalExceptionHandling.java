package org.example.clothingstoresapplication.exception_handling;

import org.example.clothingstoresapplication.entity.errors.Error;
import org.example.clothingstoresapplication.repository.errors.ErrorRepository;
import org.example.clothingstoresapplication.service.ErrorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;
import java.sql.SQLTimeoutException;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestControllerAdvice
public class GlobalExceptionHandling {

    private ErrorsService errorsService;

    private final ExecutorService executorService = Executors.newFixedThreadPool(1);

    @Autowired
    public GlobalExceptionHandling(ErrorsService errorsService) {
        this.errorsService = errorsService;
    }

    public void saveErrorToDatabase(String message) {
        if(message.length() > 200){
            message = message.substring(0, 200);
        }
        var result = errorsService.save(new Error(message, new Date()));
        System.out.println(result);
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionData> exceptionHandler(SQLTimeoutException exception) {
        ExceptionData exceptionData = new ExceptionData();
        exceptionData.setMessage(exception.getMessage());
        saveErrorToDatabase(exception.getMessage());
        return new ResponseEntity<>(exceptionData, HttpStatus.REQUEST_TIMEOUT);
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionData> exceptionHandler(IllegalStateException exception) {
        ExceptionData exceptionData = new ExceptionData();
        exceptionData.setMessage("Сессия была закрыта");
        saveErrorToDatabase(exception.getMessage());
        return new ResponseEntity<>(exceptionData, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionData> exceptionHandler(InvalidDataAccessResourceUsageException exception) {
        ExceptionData exceptionData = new ExceptionData();
        exceptionData.setMessage("Ошибка доступа: " + exception.getMessage());
        saveErrorToDatabase(exception.getMessage());
        return new ResponseEntity<>(exceptionData, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler
    public ResponseEntity<ExceptionData> exceptionHandler(SQLException exception) {
        ExceptionData exceptionData = new ExceptionData();
        exceptionData.setMessage(exception.getMessage());
        saveErrorToDatabase(exception.getMessage());
        return new ResponseEntity<>(exceptionData, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
