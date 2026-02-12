package com.ucacue.udipsai.modules.wais.repository;

import com.ucacue.udipsai.modules.wais.domain.WaisIndexComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WaisIndexCompositionRepository extends JpaRepository<WaisIndexComposition, Integer> {
    List<WaisIndexComposition> findByIndexCode(String indexCode);
}
