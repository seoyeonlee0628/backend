package com.welfare.check.service;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class WelfareDeadlineScraperService {

    private static final List<String> DEADLINE_KEYWORDS =
        List.of("신청기간", "접수기간", "신청기한", "모집기간", "공모기간", "마감일", "신청마감");

    private static final Pattern DATE_PATTERN =
        Pattern.compile("(\\d{4})[.\\-/년\\s](\\d{1,2})[.\\-/월\\s](\\d{1,2})");

    private static final Pattern SANGSSI_PATTERN =
        Pattern.compile("상시|연중|수시|상시모집|연중모집");

    public LocalDate scrapeDeadline(String url) {
        if (url == null || url.isBlank()) return null;
        try {
            Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36")
                .referrer("https://www.bokjiro.go.kr")
                .timeout(8000)
                .get();

            // 1. 테이블 라벨-값 방식 파싱
            LocalDate fromTable = parseFromTable(doc);
            if (fromTable != null) return fromTable;

            // 2. 전체 텍스트에서 키워드 근처 날짜 추출
            return parseFromText(doc.text());

        } catch (Exception e) {
            log.warn("마감일 스크래핑 실패 [{}]: {}", url, e.getMessage());
            return null;
        }
    }

    private LocalDate parseFromTable(Document doc) {
        // th-td 또는 dt-dd 구조에서 키워드 옆 값 추출
        for (String keyword : DEADLINE_KEYWORDS) {
            // th 태그에서 찾기
            for (Element th : doc.select("th")) {
                if (th.text().contains(keyword)) {
                    Element td = th.nextElementSibling();
                    if (td != null) {
                        LocalDate date = extractDate(td.text());
                        if (date != null) return date;
                    }
                }
            }
            // dt 태그에서 찾기
            for (Element dt : doc.select("dt")) {
                if (dt.text().contains(keyword)) {
                    Element dd = dt.nextElementSibling();
                    if (dd != null) {
                        LocalDate date = extractDate(dd.text());
                        if (date != null) return date;
                    }
                }
            }
            // class/id에 keyword가 포함된 요소
            for (Element el : doc.select("[class*=period],[class*=date],[class*=deadline]")) {
                LocalDate date = extractDate(el.text());
                if (date != null) return date;
            }
        }
        return null;
    }

    private LocalDate parseFromText(String fullText) {
        for (String keyword : DEADLINE_KEYWORDS) {
            int idx = fullText.indexOf(keyword);
            if (idx < 0) continue;
            // 키워드 뒤 80자 안에서 날짜 찾기
            String nearby = fullText.substring(idx, Math.min(idx + 80, fullText.length()));
            LocalDate date = extractDate(nearby);
            if (date != null) return date;
        }
        return null;
    }

    private LocalDate extractDate(String text) {
        if (text == null || text.isBlank()) return null;

        // "상시" 계열이면 null 반환 (날짜 없음)
        if (SANGSSI_PATTERN.matcher(text).find()) return null;

        Matcher m = DATE_PATTERN.matcher(text);
        // 여러 날짜 중 가장 늦은 날짜(마감일)를 반환
        LocalDate latest = null;
        while (m.find()) {
            try {
                int year  = Integer.parseInt(m.group(1));
                int month = Integer.parseInt(m.group(2));
                int day   = Integer.parseInt(m.group(3));
                if (year < 2020 || year > 2030 || month < 1 || month > 12 || day < 1 || day > 31)
                    continue;
                LocalDate candidate = LocalDate.of(year, month, day);
                if (latest == null || candidate.isAfter(latest)) latest = candidate;
            } catch (Exception ignored) {}
        }
        return latest;
    }
}
