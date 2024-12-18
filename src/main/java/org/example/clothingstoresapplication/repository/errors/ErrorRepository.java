package org.example.clothingstoresapplication.repository.errors;

import org.example.clothingstoresapplication.entity.errors.Error;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public interface ErrorRepository extends CrudRepository<Error, Integer> {
}
