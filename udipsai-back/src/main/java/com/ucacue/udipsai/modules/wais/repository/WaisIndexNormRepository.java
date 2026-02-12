package com.ucacue.udipsai.modules.wais.repository;

import com.ucacue.udipsai.modules.wais.domain.WaisIndexNorm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WaisIndexNormRepository extends JpaRepository<WaisIndexNorm, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT n FROM WaisIndexNorm n WHERE n.type = :type AND n.sumScaled = :sumScaled")
    Optional<WaisIndexNorm> findFirstByTypeAndSumScaled(
            @org.springframework.data.repository.query.Param("type") String type,
            @org.springframework.data.repository.query.Param("sumScaled") Integer sumScaled);
}
