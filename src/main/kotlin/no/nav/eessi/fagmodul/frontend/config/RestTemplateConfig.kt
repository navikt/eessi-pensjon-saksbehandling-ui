package no.nav.eessi.fagmodul.frontend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate

@Component
class RestTemplateConfig(val restTemplateBuilder: RestTemplateBuilder) {

    @Value("\${asdf:http://localhost:8081}")
    lateinit var fagmodulBaseUrl: String

    @Value("\${eux.baseurl:http://localhost:8082}")
    lateinit var euxBaseUrl: String


    @Bean
    fun euxRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(euxBaseUrl)
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .build()
    }

    @Bean
    fun fagmodulRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(fagmodulBaseUrl)
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .build()
    }
}
