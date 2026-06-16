package com.welfare.check.controller;

import com.welfare.check.service.WelfareApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/welfare")
@RequiredArgsConstructor
public class WelfareController {

    private final WelfareApiService welfareApiService;

    // 중앙부처 복지서비스
    @GetMapping("/central")
    public ResponseEntity<List<Map<String, Object>>> getCentral(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(welfareApiService.getCentralWelfareList(page, size));
    }

    // 지자체 복지서비스
    @GetMapping("/local")
    public ResponseEntity<List<Map<String, Object>>> getLocal(
            @RequestParam(defaultValue = "") String region,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(welfareApiService.getLocalWelfareList(region, page, size));
    }

    // 워크넷 채용공고
    @GetMapping("/jobs")
    public ResponseEntity<List<Map<String, Object>>> getJobs(
            @RequestParam(defaultValue = "") String job,
            @RequestParam(defaultValue = "") String region,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(welfareApiService.getWorknetJobs(job, region, page, size));
    }

    // HRD-Net 훈련과정
    @GetMapping("/courses")
    public ResponseEntity<List<Map<String, Object>>> getCourses(
            @RequestParam(defaultValue = "") String job,
            @RequestParam(defaultValue = "") String region,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(welfareApiService.getHrdnetCourses(job, region, page, size));
    }

    // 중앙+지자체 통합 목록
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(welfareApiService.getAllWelfareList(page, size));
    }

    // 복지서비스 상세
    @GetMapping("/{serviceId}")
    public ResponseEntity<Map<String, Object>> getDetail(@PathVariable String serviceId) {
        return ResponseEntity.ok(welfareApiService.getWelfareDetail(serviceId));
    }
}
