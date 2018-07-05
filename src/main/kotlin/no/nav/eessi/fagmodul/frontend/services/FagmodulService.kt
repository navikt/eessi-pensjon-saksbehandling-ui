package no.nav.eessi.fagmodul.frontend.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.nav.eessi.eessifagmodul.utils.createErrorMessage
import no.nav.eessi.eessifagmodul.utils.typeRef
import no.nav.eessi.eessifagmodul.utils.typeRefs
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.io.IOException

@Service
class FagmodulService(val fagmodulRestTemplate: RestTemplate) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulService::class.java) }

    private val FAG_PATH: String = "/api"

    private val objectMapper = jacksonObjectMapper()


    fun create(frontRequest: FrontendRequest): String? {
        val path = "/api/create"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        //.queryParam("RINASaksnummer", euSaksnr)

        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)
        return response.body
    }


}