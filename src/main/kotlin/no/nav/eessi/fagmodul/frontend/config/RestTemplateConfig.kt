package no.nav.eessi.fagmodul.frontend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.http.client.BufferingClientHttpRequestFactory
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.stereotype.Component
import org.springframework.web.client.DefaultResponseErrorHandler
import org.springframework.web.client.RestTemplate
import springfox.documentation.swagger2.mappers.SerializableParameterFactories.factory

@Component
class RestTemplateConfig(val restTemplateBuilder: RestTemplateBuilder) {

    @Value("\${fagmodul.url}")
    lateinit var fagmodulUrl: String

    @Value("\${eessibasis.url}")
    lateinit var basisUrl: String

    @Bean
    fun euxRestTemplate(): RestTemplate {
        val restTemplate = restTemplateBuilder
            .rootUri(basisUrl)
            .errorHandler(DefaultResponseErrorHandler())
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .build()
            //must be add for logging or data is lost after logging.
            restTemplate.requestFactory = BufferingClientHttpRequestFactory(SimpleClientHttpRequestFactory())
            return restTemplate
    }

    @Bean
    fun fagmodulRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(fagmodulUrl)
            .errorHandler(DefaultResponseErrorHandler())
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .build()
    }
}
