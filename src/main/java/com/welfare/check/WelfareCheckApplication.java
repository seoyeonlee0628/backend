package com.welfare.check;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WelfareCheckApplication {
    public static void main(String[] args) {
        SpringApplication.run(WelfareCheckApplication.class, args);
    }
}


