package org.example.clothingstoresapplication.repository.errors;

import org.example.clothingstoresapplication.entity.errors_logging.LogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogEntityRepository extends CrudRepository<LogEntity, Integer> {
    Page<LogEntity>findAll(Pageable pageable);
}
