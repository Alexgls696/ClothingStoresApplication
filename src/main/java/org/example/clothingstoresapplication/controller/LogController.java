package org.example.clothingstoresapplication.controller;

import org.example.clothingstoresapplication.entity.errors_logging.Error;
import org.example.clothingstoresapplication.entity.errors_logging.LogEntity;
import org.example.clothingstoresapplication.repository.errors.LogEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@Transactional
public class LogController {
    private LogEntityRepository logEntityRepository;

    @Autowired
    public LogController(LogEntityRepository logEntityRepository) {
        this.logEntityRepository = logEntityRepository;
    }

    @GetMapping
    public Iterable<LogEntity> findAll() {
        return logEntityRepository.findAll();
    }

    @GetMapping("/{id}")
    public LogEntity findById(@PathVariable int id) {
        return logEntityRepository.findById(id).orElse(null);
    }

    @PostMapping
    public LogEntity save(@RequestBody LogEntity logEntity) {
        return logEntityRepository.save(logEntity);
    }

    @PostMapping("/deleteAll")
    public void deleteAll() {
        logEntityRepository.deleteAll();
    }

    @DeleteMapping
    public void deleteById(@RequestParam int id) {
        logEntityRepository.deleteById(id);
    }

    private Pageable pageable(int number, Sort sort){
        return PageRequest.of(number,40,sort);
    }

    @GetMapping("/sort")
    public Iterable<LogEntity> getLogEntityWithPaginationAndSort(@RequestParam Map<String,String> parameters){
        String sortType = parameters.get("sortType");
        String sortBy = parameters.get("sortBy");
        int pageNumber = Integer.parseInt(parameters.get("pageNumber"));
        Sort sort = Sort.by(sortType.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,sortBy);
        return logEntityRepository.findAll(pageable(pageNumber,sort));
    }

    @GetMapping("/count")
    public Long countErrors(){
        return logEntityRepository.count();
    }
}
