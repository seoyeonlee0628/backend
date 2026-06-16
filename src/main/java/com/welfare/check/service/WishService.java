package com.welfare.check.service;

import com.welfare.check.dto.WishItemDto;
import com.welfare.check.dto.WishItemRequest;
import com.welfare.check.entity.User;
import com.welfare.check.entity.WishItem;
import com.welfare.check.repository.UserRepository;
import com.welfare.check.repository.WishItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;
import org.springframework.scheduling.annotation.Async;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

@Service
@RequiredArgsConstructor
public class WishService {

    private final WishItemRepository wishItemRepository;
    private final UserRepository userRepository;
    private final WelfareDeadlineScraperService scraperService;

    public List<WishItemDto> getWishList(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        return wishItemRepository.findByUserOrderByEndDateAsc(user)
            .stream().map(WishItemDto::from).collect(Collectors.toList());
    }

    @Transactional
    public WishItemDto addWish(WishItemRequest request, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        WishItem item = WishItem.builder()
            .user(user)
            .name(request.getName())
            .amount(request.getAmount())
            .startDate(safeParseDate(request.getStartDate(), null))
            .endDate(safeParseDate(request.getEndDate(), null))
            .applyUrl(request.getApplyUrl())
            .build();
        WishItem saved = wishItemRepository.save(item);
        // 찜 추가 직후 마감일 자동 탐색 (백그라운드)
        if (saved.getApplyUrl() != null && !saved.getApplyUrl().isBlank()) {
            autoFillDeadline(saved.getId(), saved.getApplyUrl());
        }
        return WishItemDto.from(saved);
    }

    @Async
    @Transactional
    public void autoFillDeadline(Long wishItemId, String url) {
        LocalDate deadline = scraperService.scrapeDeadline(url);
        if (deadline != null) {
            wishItemRepository.findById(wishItemId).ifPresent(w -> {
                w.setEndDate(deadline);
                wishItemRepository.save(w);
            });
        }
    }

    @Transactional
    public void removeWish(Long id, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        wishItemRepository.deleteByIdAndUser(id, user);
    }

    @Transactional
    public WishItemDto updateStatus(Long id, String status, String username) {
        Set<String> allowed = Set.of("INTERESTED", "APPLIED", "RECEIVED");
        if (!allowed.contains(status)) throw new IllegalArgumentException("잘못된 상태값입니다.");
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        WishItem item = wishItemRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("항목을 찾을 수 없습니다."));
        if (!item.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("권한이 없습니다.");
        item.setApplicationStatus(status);
        return WishItemDto.from(wishItemRepository.save(item));
    }

    @Transactional
    public WishItemDto scrapeAndUpdateDeadline(Long id, String username, WelfareDeadlineScraperService scraper) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        WishItem item = wishItemRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("항목을 찾을 수 없습니다."));
        if (!item.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("권한이 없습니다.");

        java.time.LocalDate deadline = scraper.scrapeDeadline(item.getApplyUrl());
        if (deadline != null) item.setEndDate(deadline);
        return WishItemDto.from(wishItemRepository.save(item));
    }

    // 마감 7일 이내 항목 반환 (상태가 RECEIVED가 아닌 것만)
    public List<WishItemDto> getDeadlineSoon(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(7);
        return wishItemRepository.findByUserOrderByEndDateAsc(user).stream()
            .filter(w -> w.getEndDate() != null
                && !w.getEndDate().isBefore(today)
                && !w.getEndDate().isAfter(threshold)
                && !"RECEIVED".equals(w.getApplicationStatus()))
            .map(WishItemDto::from)
            .collect(Collectors.toList());
    }

    /** 유효한 ISO 날짜(yyyy-MM-dd)만 파싱. 나머지는 fallback 반환 */
    private LocalDate safeParseDate(String dateStr, LocalDate fallback) {
        if (dateStr == null || dateStr.isBlank()) return fallback;
        try {
            return LocalDate.parse(dateStr);
        } catch (DateTimeParseException e) {
            return fallback;
        }
    }
}
