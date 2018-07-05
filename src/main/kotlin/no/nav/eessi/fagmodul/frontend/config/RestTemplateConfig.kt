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

    @Value("\${asdf:http://localhost:8081}")
    lateinit var fagmodulBaseUrl: String

    @Value("\${eux.baseurl:http://localhost:8082}")
    lateinit var euxBaseUrl: String


    @Bean
    fun euxRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(euxBaseUrl)
            .errorHandler(DefaultResponseErrorHandler())
            //.additionalInterceptors(RequestResponseLoggerInterceptor())
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            //.requestFactory(SimpleClientHttpRequestFactory::class.java)
            //.requestFactory(BufferingClientHttpRequestFactory::class.java)
            .build()
    }

    @Bean
    fun fagmodulRestTemplate(): RestTemplate {
        return restTemplateBuilder
            .rootUri(fagmodulBaseUrl)
            .errorHandler(DefaultResponseErrorHandler())
            //.additionalInterceptors(RequestResponseLoggerInterceptor())
            .additionalInterceptors(OidcHeaderRequestInterceptor())
            .build()
    }
}
