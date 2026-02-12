package com.ucacue.udipsai.modules.wais.repository;

import com.ucacue.udipsai.modules.wais.domain.WaisNormRawToScaled;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface WaisNormRawToScaledRepository extends JpaRepository<WaisNormRawToScaled, Long> {

    Optional<WaisNormRawToScaled> findFirstByAgeGroupIdAndSubtestIdAndRawScore(Integer ageGroupId, Integer subtestId,
            Integer rawScore);

    @org.springframework.transaction.annotation.Transactional
    void deleteByAgeGroupId(Integer ageGroupId);
}
