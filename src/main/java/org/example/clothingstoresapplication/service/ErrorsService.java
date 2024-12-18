package org.example.clothingstoresapplication.service;

import org.example.clothingstoresapplication.entity.errors.Error;
import org.example.clothingstoresapplication.repository.errors.ErrorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class ErrorsService {
    @Autowired
    private ErrorRepository errorRepository;

    public Error save(Error error) {
       return errorRepository.save(error);
    }
}
