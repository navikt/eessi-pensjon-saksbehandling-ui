package no.nav.eessi.fagmodul.frontend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.http.client.BufferingClientHttpRequestFactory
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.stereotype.Component
import org.springframework.web.client.DefaultResponseErrorHandler
import org.springframework.web.client.RestTemplate

@Component
class RestTemplateConfig(val restTemplateBuilder: RestTemplateBuilder) {

    @Value("\${eessifagmodulservice.url}")
    lateinit var fagmodulUrl: String

    @Value("\${euxbasis.v1.url}")
    lateinit var basisUrl: String

    @Bean
    fun euxRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(basisUrl)
            .errorHandler(DefaultResponseErrorHandler())
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .additionalInterceptors(RequestResponseLoggerInterceptor())
            .build().apply {
                    requestFactory = BufferingClientHttpRequestFactory(SimpleClientHttpRequestFactory())
                }
    }

    @Bean
    fun fagmodulRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(fagmodulUrl)
            .errorHandler(DefaultResponseErrorHandler())
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .additionalInterceptors(RequestResponseLoggerInterceptor())
            .build().apply {
                    requestFactory = BufferingClientHttpRequestFactory(SimpleClientHttpRequestFactory())
                }
    }
}
