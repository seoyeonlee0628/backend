package com.welfare.check.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class WelfareApiService {

    private final WebClient webClient;

    // ── API 키 ────────────────────────────────────────────────────
    @Value("${welfareapi.central-key}")
    private String centralApiKey;

    @Value("${welfareapi.local-key}")
    private String localApiKey;

    @Value("${apis.worknet-key:}")
    private String worknetApiKey;

    @Value("${apis.hrdnet-key:}")
    private String hrdnetApiKey;

    // ── 엔드포인트 ────────────────────────────────────────────────
    private static final String CENTRAL_WELFARE_URL =
        "https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001";
    private static final String LOCAL_WELFARE_URL =
        "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist";
    private static final String WORKNET_URL =
        "https://openapi.work.go.kr/opi/opi/opia/wantedApi.do";
    private static final String HRDNET_URL =
        "https://www.hrd.go.kr/jsp/HRDP/HRDPCO/PCOAO/PCOAO0100L.jsp";

    // 청년 관련 생애주기 코드 (lifeArray 파라미터 - 코드표 기준)
    private static final String[] YOUTH_LIFE_CODES = {"003", "004", "005"};  // 청소년, 청년, 중장년

    // ── 중앙부처 복지서비스 ───────────────────────────────────────
    public List<Map<String, Object>> getCentralWelfareList(int page, int size) {
        List<Map<String, Object>> result = new ArrayList<>();
        // callTp=L (목록), srchKeyCode=003 (제목+내용), 여러 생애주기로 청년 서비스 수집
        for (String lifeCode : YOUTH_LIFE_CODES) {
            try {
                String uri = UriComponentsBuilder.fromHttpUrl(CENTRAL_WELFARE_URL)
                    .queryParam("serviceKey", centralApiKey)
                    .queryParam("callTp", "L")
                    .queryParam("pageNo", page)
                    .queryParam("numOfRows", size)
                    .queryParam("srchKeyCode", "003")
                    .queryParam("lifeArray", lifeCode)
                    .build(false).toUriString();
                String response = fetch(uri);
                List<Map<String, Object>> items = parseWelfareXml(response);
                log.info("중앙부처 복지서비스 lifeArray={} -> {}건", lifeCode, items.size());
                result.addAll(items);
            } catch (Exception e) {
                log.warn("중앙부처 복지서비스 조회 실패 (lifeArray={}): {}", lifeCode, e.getMessage());
            }
        }
        return result;
    }

    // ── 지자체 복지서비스 ─────────────────────────────────────────
    public List<Map<String, Object>> getLocalWelfareList(String region, int page, int size) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(LOCAL_WELFARE_URL)
                .queryParam("serviceKey", localApiKey)
                .queryParam("pageNo", page)
                .queryParam("numOfRows", size);
            if (region != null && !region.isBlank())
                builder.queryParam("ctpvNm", region);
            String response = fetch(builder.build(false).toUriString());
            return parseWelfareXmlWithSource(response, "지자체");
        } catch (Exception e) {
            log.error("지자체 복지서비스 조회 실패", e);
            return Collections.emptyList();
        }
    }

    // ── 중앙+지자체 통합 목록 ────────────────────────────────────
    public List<Map<String, Object>> getAllWelfareList(int page, int size) {
        List<Map<String, Object>> result = new ArrayList<>();
        result.addAll(getCentralWelfareList(page, size));
        result.addAll(getLocalWelfareList(null, page, size));
        return result;
    }

    // ── 워크넷 채용공고 ───────────────────────────────────────────
    public List<Map<String, Object>> getWorknetJobs(String job, String region, int page, int size) {
        if (worknetApiKey == null || worknetApiKey.isBlank()) {
            log.warn("WORKNET_API_KEY 미설정 — 채용공고 API 비활성화");
            return Collections.emptyList();
        }
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(WORKNET_URL)
                .queryParam("authKey", worknetApiKey)
                .queryParam("callTp", "L")
                .queryParam("returnType", "XML")
                .queryParam("startPage", page)
                .queryParam("display", size);
            if (job != null && !job.isBlank())
                builder.queryParam("jobsNm", job);
            if (region != null && !region.isBlank())
                builder.queryParam("region", region);
            String response = fetch(builder.build(false).toUriString());
            return parseWorknetXml(response);
        } catch (Exception e) {
            log.error("워크넷 채용공고 조회 실패", e);
            return Collections.emptyList();
        }
    }

    // ── HRD-Net 훈련과정 ─────────────────────────────────────────
    public List<Map<String, Object>> getHrdnetCourses(String job, String region, int page, int size) {
        if (hrdnetApiKey == null || hrdnetApiKey.isBlank()) {
            log.warn("HRDNET_API_KEY 미설정 — 훈련과정 API 비활성화");
            return Collections.emptyList();
        }
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(HRDNET_URL)
                .queryParam("authKey", hrdnetApiKey)
                .queryParam("returnType", "XML")
                .queryParam("pageNum", page)
                .queryParam("pageSize", size)
                .queryParam("outType", "1");
            if (job != null && !job.isBlank())
                builder.queryParam("srchTraNm", job);
            if (region != null && !region.isBlank())
                builder.queryParam("srchTraArea1", region);
            String response = fetch(builder.build(false).toUriString());
            return parseHrdnetXml(response);
        } catch (Exception e) {
            log.error("HRD-Net 훈련과정 조회 실패", e);
            return Collections.emptyList();
        }
    }

    // ── AI용 요약 문자열 ─────────────────────────────────────────
    public String getWelfareListForAI() {
        List<Map<String, Object>> list = getLocalWelfareList(null, 1, 50);
        if (list.isEmpty()) return getDefaultWelfareList();
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> item : list) {
            String name    = (String) item.getOrDefault("name", "");
            String summary = (String) item.getOrDefault("summary", "");
            String url     = (String) item.getOrDefault("url", "https://www.bokjiro.go.kr");
            if (summary.length() > 150) summary = summary.substring(0, 150) + "...";
            if (url.isBlank()) url = "https://www.bokjiro.go.kr";
            sb.append("- ").append(name)
              .append(" [url:").append(url).append("]")
              .append(": ").append(summary).append("\n");
        }
        return sb.toString();
    }

    public Map<String, Object> getWelfareDetail(String serviceId) {
        return Collections.emptyMap();
    }

    // ── XML 파서 ─────────────────────────────────────────────────
    private List<Map<String, Object>> parseWelfareXml(String xml) {
        return parseWelfareXmlWithSource(xml, "중앙부처");
    }

    private List<Map<String, Object>> parseWelfareXmlWithSource(String xml, String source) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Document doc = buildDoc(xml);
            NodeList items = doc.getElementsByTagName("servList");
            for (int i = 0; i < items.getLength(); i++) {
                Element el = (Element) items.item(i);
                Map<String, Object> map = new HashMap<>();
                String name    = getTag(el, "servNm");
                String summary = getTag(el, "servDgst");
                String life    = getTag(el, "lifeArray");
                String theme   = getTag(el, "intrsThemaNmArray");
                String region  = getTag(el, "ctpvNm");
                map.put("id",           getTag(el, "servId"));
                map.put("name",         name);
                map.put("summary",      summary);
                map.put("url",          getTag(el, "servDtlLink"));
                map.put("ministry",     getTag(el, "bizChrDeptNm"));
                map.put("region",       region);
                map.put("target",       getTag(el, "servTrgt"));
                map.put("supportType",  getTag(el, "wlfareInfoReldBztpSe"));
                map.put("supportCycle", getTag(el, "sprtCycNm"));
                map.put("lifeCycle",    life);
                map.put("theme",        theme);
                map.put("source",       region.isBlank() ? source : "지자체");
                map.put("category",     inferCategory(name, summary, life, theme));
                result.add(map);
            }
        } catch (Exception e) {
            log.error("복지서비스 XML 파싱 실패: {}", e.getMessage());
        }
        return result;
    }

    private String inferCategory(String name, String summary, String life, String theme) {
        String text = (name + " " + summary + " " + life + " " + theme).toLowerCase();
        if (text.contains("주거") || text.contains("월세") || text.contains("전세") ||
            text.contains("주택") || text.contains("임대") || text.contains("거주"))    return "주거";
        if (text.contains("취업") || text.contains("일자리") || text.contains("채용") ||
            text.contains("고용") || text.contains("구직") || text.contains("근로"))    return "취업일자리";
        if (text.contains("건강") || text.contains("의료") || text.contains("보건") ||
            text.contains("치료") || text.contains("병원") || text.contains("마음"))    return "의료건강";
        if (text.contains("저소득") || text.contains("기초수급") || text.contains("차상위") ||
            text.contains("생계") || text.contains("긴급복지"))                          return "저소득";
        if (text.contains("출산") || text.contains("임신") || text.contains("산모") ||
            text.contains("출생"))                                                       return "출산임신";
        if (text.contains("아동") || text.contains("보육") || text.contains("어린이") ||
            text.contains("유아"))                                                       return "아동보육";
        if (text.contains("노인") || text.contains("어르신") || text.contains("고령") ||
            text.contains("노령"))                                                       return "노인";
        if (text.contains("장애") || text.contains("장해"))                             return "장애인";
        if (text.contains("한부모") || text.contains("한 부모"))                         return "한부모";
        if (text.contains("신혼") || text.contains("혼인"))                             return "신혼부부";
        if (text.contains("다자녀") || text.contains("다 자녀"))                         return "다자녀";
        if (text.contains("청소년") || text.contains("10대") || text.contains("중학") ||
            text.contains("고등"))                                                       return "청소년";
        if (text.contains("보훈") || text.contains("국가유공"))                          return "보훈";
        if (text.contains("훈련") || text.contains("교육") || text.contains("장학") ||
            text.contains("학습"))                                                       return "취업일자리";
        if (text.contains("저축") || text.contains("자산") || text.contains("계좌") ||
            text.contains("도약") || text.contains("내일"))                              return "자립";
        if (text.contains("청년") || life.contains("청년"))                              return "청년";
        return "청년";
    }

    private List<Map<String, Object>> parseWorknetXml(String xml) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Document doc = buildDoc(xml);
            NodeList items = doc.getElementsByTagName("wanted");
            for (int i = 0; i < items.getLength(); i++) {
                Element el = (Element) items.item(i);
                Map<String, Object> map = new HashMap<>();
                map.put("id",       getTag(el, "wantedAuthNo"));
                map.put("company",  getTag(el, "company"));
                map.put("title",    getTag(el, "title"));
                map.put("salary",   getTag(el, "salTpNm") + " " + getTag(el, "sal") + "만원");
                map.put("region",   getTag(el, "region"));
                map.put("career",   getTag(el, "career"));
                map.put("empType",  getTag(el, "empTpNm"));
                map.put("deadline", getTag(el, "closeDt"));
                map.put("url",      getTag(el, "wantedInfoUrl"));
                result.add(map);
            }
        } catch (Exception e) {
            log.error("워크넷 XML 파싱 실패: {}", e.getMessage());
        }
        return result;
    }

    private List<Map<String, Object>> parseHrdnetXml(String xml) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Document doc = buildDoc(xml);
            // HRD-Net 응답 태그명 (srchList 또는 trcoList)
            NodeList items = doc.getElementsByTagName("srchList");
            if (items.getLength() == 0) items = doc.getElementsByTagName("trco");
            for (int i = 0; i < items.getLength(); i++) {
                Element el = (Element) items.item(i);
                Map<String, Object> map = new HashMap<>();
                map.put("name",      getTag(el, "trainsNm"));
                map.put("institute", getTag(el, "subTitle"));
                map.put("region",    getTag(el, "traArea1Nm"));
                map.put("startDate", getTag(el, "traStartDate"));
                map.put("endDate",   getTag(el, "traEndDate"));
                map.put("cost",      getTag(el, "courseMan") + "원");
                map.put("url",       getTag(el, "titleLink"));
                result.add(map);
            }
        } catch (Exception e) {
            log.error("HRD-Net XML 파싱 실패: {}", e.getMessage());
        }
        return result;
    }

    // ── 공통 유틸 ────────────────────────────────────────────────
    private String fetch(String uri) {
        return webClient.get()
            .uri(uri)
            .retrieve()
            .bodyToMono(String.class)
            .block();
    }

    private Document buildDoc(String xml) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setAttribute(javax.xml.XMLConstants.ACCESS_EXTERNAL_DTD, "");
        factory.setAttribute(javax.xml.XMLConstants.ACCESS_EXTERNAL_SCHEMA, "");
        factory.setExpandEntityReferences(false);
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(new InputSource(new StringReader(xml)));
    }

    private String getTag(Element el, String tag) {
        NodeList nodes = el.getElementsByTagName(tag);
        return nodes.getLength() > 0 ? nodes.item(0).getTextContent().trim() : "";
    }

    private String getDefaultWelfareList() {
        return """
            - 구직촉진수당: 취업 준비 중인 청년에게 최대 300만원 지원 (월 50만원 × 6개월)
            - 청년내일저축계좌: 저소득 근로청년 자산 형성 지원, 3년 최대 1,440만원
            - 청년 월세 특별지원: 청년 1인 가구 월세 최대 20만원 × 12개월
            - 내일배움카드: 직업훈련비 최대 500만원 지원
            - 청년도약계좌: 월 최대 70만원 저축 시 정부 매칭, 5년 최대 5,000만원
            """;
    }
}
