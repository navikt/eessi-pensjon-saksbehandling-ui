package no.nav.eessi.fagmodul.frontend.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.models.SED
import no.nav.eessi.fagmodul.frontend.utils.typeRef
import no.nav.eessi.fagmodul.frontend.utils.typeRefs
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import org.springframework.web.util.UriComponentsBuilder
import java.io.IOException
import kotlin.math.log

@Service
class FagmodulService(val fagmodulRestTemplate: RestTemplate) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulService::class.java) }

    private val FAG_PATH: String = "/api"

    fun landkoder(): List<String> {
        val path = "/landkoder"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity("", HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, typeRef<List<String>>())
        return response.body!!

    }

    fun create(frontRequest: FrontendRequest): String? {
        logger.debug("create reqeust to fagmodul : $frontRequest")
        val path = "/create"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)
        return response.body
    }

    fun confirm(frontRequest: FrontendRequest): String? {
        logger.debug("create reqeust to fagmodul : $frontRequest")
        val path = "/confirm"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)
        return response.body
    }
}