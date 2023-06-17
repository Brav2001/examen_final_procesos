package com.procesos.parcial_1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class Parcial1Application {

	@Bean
	public RestTemplate getresttemplate() {
		return new RestTemplate();
	}
	public static void main(String[] args) {
		SpringApplication.run(Parcial1Application.class, args);
	}

}
