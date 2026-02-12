package com.ucacue.udipsai.modules.wais.repository;

import com.ucacue.udipsai.modules.wais.domain.WaisSubtest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WaisSubtestRepository extends JpaRepository<WaisSubtest, Integer> {
    Optional<WaisSubtest> findFirstByCode(String code);
}
