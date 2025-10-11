// java
package com.macrosur.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Configuration
public class RequestLoggingConfig {

    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter f = new CommonsRequestLoggingFilter();
        f.setIncludeClientInfo(true);
        f.setIncludeQueryString(true);
        f.setIncludePayload(true);
        f.setMaxPayloadLength(2000);
        f.setIncludeHeaders(false);
        return f;
    }
}
