package com.macrosur.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MacrosurEcommerceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MacrosurEcommerceBackendApplication.class, args);
	}

}
