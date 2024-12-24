package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.errors_logging.Error;
import org.example.clothingstoresapplication.repository.errors.ErrorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/errors")
@Transactional
public class ErrorsController {
    private ErrorRepository errorRepository;

    @Autowired
    public ErrorsController(ErrorRepository errorRepository) {
        this.errorRepository = errorRepository;
    }

    @GetMapping("/{id}")
    public Error getErrorById(@PathVariable("id") Integer id) {
        return errorRepository.findById(id).orElse(null);
    }

    @GetMapping
    public Iterable<Error> getAllErrors() {
        return errorRepository.findAll();
    }

    @PostMapping
    public Error saveError(@RequestBody Error error) {
        return errorRepository.save(error);
    }

    @PostMapping("/deleteAll")
    public void deleteAllErrors() {
        errorRepository.deleteAll();
    }

    @DeleteMapping("/{id}")
    public void deleteErrorById(@PathVariable("id") Integer id) {
        errorRepository.deleteById(id);
    }

    private Pageable pageable(int number, Sort sort){
        return PageRequest.of(number,40,sort);
    }

    @GetMapping("/sort")
    public Iterable<Error> getErrorsWithPaginationAndSort(@RequestParam Map<String,String> parameters){
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        int pageNumber = Integer.parseInt(parameters.get("pageNumber"));
        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,sortBy);
        return errorRepository.findAll(pageable(pageNumber,sort));
    }

    @GetMapping("/count")
    public Long countErrors(){
        return errorRepository.count();
    }
}
