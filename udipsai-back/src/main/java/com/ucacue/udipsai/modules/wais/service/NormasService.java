package com.ucacue.udipsai.modules.wais.service;

import com.ucacue.udipsai.modules.wais.domain.WaisAgeGroup;
import com.ucacue.udipsai.modules.wais.domain.WaisNormRawToScaled;
import com.ucacue.udipsai.modules.wais.domain.WaisSubtest;
import com.ucacue.udipsai.modules.wais.repository.WaisAgeGroupRepository;
import com.ucacue.udipsai.modules.wais.repository.WaisNormRawToScaledRepository;
import com.ucacue.udipsai.modules.wais.repository.WaisSubtestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NormasService {

    private final WaisAgeGroupRepository ageGroupRepository;
    private final WaisSubtestRepository subtestRepository;
    private final WaisNormRawToScaledRepository normRepository;

    public Integer getScaledScore(Integer ageMonths, String subtestCode, Integer rawScore) {
        java.util.List<WaisAgeGroup> ageGroups = ageGroupRepository.findByAge(ageMonths);
        if (ageGroups.isEmpty()) {
            return null; // or throw exception "Age group not found"
        }
        WaisAgeGroup ageGroup = ageGroups.get(0); // Take first if duplicates exist

        Optional<WaisSubtest> subtestOpt = subtestRepository.findFirstByCode(subtestCode);
        if (subtestOpt.isEmpty()) {
            return null; // or throw exception "Subtest not found"
        }

        Optional<WaisNormRawToScaled> normOpt = normRepository.findFirstByAgeGroupIdAndSubtestIdAndRawScore(
                ageGroup.getId(),
                subtestOpt.get().getId(),
                rawScore);

        return normOpt.map(WaisNormRawToScaled::getScaledScore).orElse(null);
    }
}
