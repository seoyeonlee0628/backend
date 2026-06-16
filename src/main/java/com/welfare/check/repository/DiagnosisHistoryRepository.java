package com.welfare.check.repository;

import com.welfare.check.entity.DiagnosisHistory;
import com.welfare.check.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiagnosisHistoryRepository extends JpaRepository<DiagnosisHistory, Long> {
    List<DiagnosisHistory> findByUserOrderByCreatedAtDesc(User user);
    List<DiagnosisHistory> findTop5ByUserOrderByCreatedAtDesc(User user);
}
