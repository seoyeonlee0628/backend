package com.welfare.check;

import jakarta.annotation.PreDestroy;
import org.springframework.boot.ansi.AnsiColor;
import org.springframework.boot.ansi.AnsiOutput;
import org.springframework.boot.ansi.AnsiStyle;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.File;
import java.net.HttpURLConnection;
import java.net.URL;

@Component
public class StartupBanner {

    private final Environment env;
    private Process pythonProcess;

    public StartupBanner(Environment env) {
        this.env = env;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        String port       = env.getProperty("server.port", "8080");
        String pythonLine = startPythonBackground();
        String bar        = color("=".repeat(60), AnsiColor.BRIGHT_CYAN, AnsiStyle.BOLD);

        System.out.println();
        System.out.println(bar);
        System.out.println(
                color("  >>  ", AnsiColor.BRIGHT_CYAN, AnsiStyle.BOLD) +
                color("복지체크 서버 준비 완료!", null, AnsiStyle.BOLD));
        System.out.println();
        System.out.println(
                "  " + color("접속 주소", null, AnsiStyle.BOLD) +
                "  ->  " +
                color("http://localhost:" + port, AnsiColor.BRIGHT_GREEN, AnsiStyle.BOLD));
        System.out.println();
        System.out.println(
                "  Spring Boot  " +
                color("✔ 실행 중", AnsiColor.BRIGHT_GREEN, null) +
                "   |   Python ML  " +
                pythonLine);
        System.out.println(bar);
        System.out.println();
    }

    private String startPythonBackground() {
        if (isPythonAlive()) {
            return color("✔ 이미 실행 중", AnsiColor.BRIGHT_GREEN, null);
        }

        File mlDir = new File("ml_model");
        if (!mlDir.exists()) {
            return color("✘ ml_model 폴더 없음", AnsiColor.BRIGHT_RED, null);
        }

        for (String cmd : new String[]{"python", "py", "python3"}) {
            try {
                ProcessBuilder pb = new ProcessBuilder(cmd, "server.py");
                pb.directory(mlDir);
                pb.redirectErrorStream(true);
                pb.inheritIO();
                pythonProcess = pb.start();
                return color(">> 시작 중... (아래 로그 확인)", AnsiColor.BRIGHT_YELLOW, null);
            } catch (Exception ignored) {}
        }
        return color("✘ python 명령 없음 — PATH 확인 필요", AnsiColor.BRIGHT_RED, null);
    }

    private boolean isPythonAlive() {
        try {
            HttpURLConnection conn = (HttpURLConnection)
                    new URL("http://localhost:8000/health").openConnection();
            conn.setConnectTimeout(500);
            conn.setReadTimeout(500);
            return conn.getResponseCode() == 200;
        } catch (Exception e) {
            return false;
        }
    }

    private String color(String text, AnsiColor c, AnsiStyle s) {
        if (c != null && s != null) return AnsiOutput.toString(c, s, text, AnsiStyle.NORMAL);
        if (c != null)              return AnsiOutput.toString(c, text, AnsiColor.DEFAULT);
        if (s != null)              return AnsiOutput.toString(s, text, AnsiStyle.NORMAL);
        return text;
    }

    @PreDestroy
    public void onShutdown() {
        if (pythonProcess != null && pythonProcess.isAlive()) {
            System.out.println(
                color("[복지체크] Python ML 서버 종료 중...", AnsiColor.BRIGHT_YELLOW, null));
            pythonProcess.destroy();
        }
    }
}
