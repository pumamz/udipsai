package com.ucacue.udipsai.modules.wais.repository;

import com.ucacue.udipsai.modules.wais.domain.WaisAgeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface WaisAgeGroupRepository extends JpaRepository<WaisAgeGroup, Integer> {

    @Query("SELECT g FROM WaisAgeGroup g WHERE :ageMonths BETWEEN g.minAgeMonths AND g.maxAgeMonths")
    java.util.List<WaisAgeGroup> findByAge(Integer ageMonths);
}
