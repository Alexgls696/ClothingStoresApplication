package org.example.clothingstoresapplication.repository.errors;

import org.example.clothingstoresapplication.entity.errors.Error;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorRepository extends CrudRepository<Error, Integer> {
}
