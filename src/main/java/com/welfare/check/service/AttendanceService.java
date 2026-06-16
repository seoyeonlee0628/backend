package com.welfare.check.service;

import com.welfare.check.entity.User;
import com.welfare.check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final UserRepository userRepository;

    public static final Map<String, Integer> BADGE_SHOP = Map.of(
        "복지마스터", 100,
        "취준챔피언", 200
    );
    public static final Map<String, String> BADGE_EMOJI = Map.of(
        "첫걸음", "🌱", "열정가득", "🔥", "취준불꽃", "⚡", "출석왕", "🏆",
        "복지마스터", "💎", "취준챔피언", "🎯"
    );

    @Transactional
    public Map<String, Object> checkIn(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        LocalDate today = LocalDate.now();
        if (today.equals(user.getLastCheckIn())) {
            return Map.of("success", false, "message", "오늘은 이미 출석했어요!");
        }

        // 스트릭 계산
        int newStreak = (user.getLastCheckIn() != null && user.getLastCheckIn().plusDays(1).equals(today))
            ? user.getStreak() + 1 : 1;

        // 포인트 계산
        int earned = 10;
        String bonus = null;
        if (newStreak % 30 == 0) { earned += 300; bonus = "30일 연속 출석 보너스!"; }
        else if (newStreak % 7 == 0) { earned += 100; bonus = "7일 연속 출석 보너스!"; }
        else if (newStreak % 3 == 0) { earned += 30; bonus = "3일 연속 출석 보너스!"; }

        user.setStreak(newStreak);
        user.setPoints(user.getPoints() + earned);
        user.setLastCheckIn(today);

        // 뱃지 자동 지급
        List<String> newBadges = new ArrayList<>();
        Set<String> existing = new HashSet<>(
            user.getBadges() == null || user.getBadges().isBlank()
                ? Collections.emptyList()
                : Arrays.asList(user.getBadges().split(","))
        );
        if (newStreak == 1 && !existing.contains("첫걸음")) { existing.add("첫걸음"); newBadges.add("🌱 첫걸음"); }
        if (newStreak >= 3 && !existing.contains("열정가득")) { existing.add("열정가득"); newBadges.add("🔥 열정가득"); }
        if (newStreak >= 7 && !existing.contains("취준불꽃")) { existing.add("취준불꽃"); newBadges.add("⚡ 취준불꽃"); }
        if (newStreak >= 30 && !existing.contains("출석왕")) { existing.add("출석왕"); newBadges.add("🏆 출석왕"); }
        user.setBadges(String.join(",", existing));

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("streak", newStreak);
        result.put("earned", earned);
        result.put("totalPoints", user.getPoints());
        result.put("bonus", bonus);
        result.put("newBadges", newBadges);
        return result;
    }

    @Transactional
    public Map<String, Object> buyBadge(String username, String badgeName) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Integer cost = BADGE_SHOP.get(badgeName);
        if (cost == null) return Map.of("success", false, "message", "존재하지 않는 뱃지입니다.");

        Set<String> existing = new HashSet<>(
            user.getBadges() == null || user.getBadges().isBlank()
                ? Collections.emptyList()
                : Arrays.asList(user.getBadges().split(","))
        );
        if (existing.contains(badgeName)) return Map.of("success", false, "message", "이미 보유한 뱃지입니다.");
        if (user.getPoints() < cost) return Map.of("success", false, "message", "포인트가 부족해요. (" + cost + "P 필요)");

        user.setPoints(user.getPoints() - cost);
        existing.add(badgeName);
        user.setBadges(String.join(",", existing));
        userRepository.save(user);

        return Map.of("success", true, "badge", BADGE_EMOJI.getOrDefault(badgeName, "") + " " + badgeName,
            "remainPoints", user.getPoints());
    }

    @Transactional
    public Map<String, Object> unlockRoadmap(String username, String jobKey) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Set<String> validJobs = Set.of("프리랜서", "유튜버");
        if (!validJobs.contains(jobKey)) return Map.of("success", false, "message", "존재하지 않는 직군입니다.");

        String badgeKey = "roadmap:" + jobKey;
        Set<String> existing = new HashSet<>(
            user.getBadges() == null || user.getBadges().isBlank()
                ? Collections.emptyList() : Arrays.asList(user.getBadges().split(","))
        );
        if (existing.contains(badgeKey)) return Map.of("success", false, "message", "이미 해금된 직군입니다.");
        if (user.getPoints() < 80) return Map.of("success", false, "message", "포인트가 부족해요. (80P 필요)");

        user.setPoints(user.getPoints() - 80);
        existing.add(badgeKey);
        user.setBadges(String.join(",", existing));
        userRepository.save(user);

        return Map.of("success", true, "job", jobKey, "remainPoints", user.getPoints());
    }

    @Transactional
    public Map<String, Object> equipEmoji(String username, String emoji) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        if (!emoji.isEmpty()) {
            Set<String> validEmojis = Set.of("💼", "🚀", "✨", "🔥", "⚡", "🎯", "🌱", "💎");
            if (!validEmojis.contains(emoji)) return Map.of("success", false, "message", "선택할 수 없는 이모지입니다.");
        }
        user.setNicknameEmoji(emoji.isEmpty() ? null : emoji);
        userRepository.save(user);
        return Map.of("success", true, "emoji", emoji);
    }

    @Transactional
    public Map<String, Object> buyEmoji(String username, String emoji) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Set<String> validEmojis = Set.of("💼", "🚀", "✨", "🔥", "⚡", "🎯", "🌱", "💎");
        if (!validEmojis.contains(emoji)) return Map.of("success", false, "message", "선택할 수 없는 이모지입니다.");
        if (user.getPoints() < 20) return Map.of("success", false, "message", "포인트가 부족해요. (20P 필요)");

        user.setPoints(user.getPoints() - 20);
        user.setNicknameEmoji(emoji);
        userRepository.save(user);

        return Map.of("success", true, "emoji", emoji, "remainPoints", user.getPoints());
    }

    public Map<String, Object> getStatus(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        LocalDate today = LocalDate.now();
        boolean checkedToday = today.equals(user.getLastCheckIn());

        List<String> allBadges = user.getBadges() == null || user.getBadges().isBlank()
            ? Collections.emptyList() : Arrays.asList(user.getBadges().split(","));
        List<String> badges = allBadges.stream()
            .filter(b -> !b.startsWith("roadmap:"))
            .collect(java.util.stream.Collectors.toList());
        List<String> unlockedRoadmaps = allBadges.stream()
            .filter(b -> b.startsWith("roadmap:"))
            .map(b -> b.substring("roadmap:".length()))
            .collect(java.util.stream.Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("points", user.getPoints());
        result.put("streak", user.getStreak());
        result.put("checkedToday", checkedToday);
        result.put("badges", badges);
        result.put("unlockedRoadmaps", unlockedRoadmaps);
        result.put("nicknameEmoji", user.getNicknameEmoji() == null ? "" : user.getNicknameEmoji());
        return result;
    }
}
