package no.nav.eessi.fagmodul.frontend.services

import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.utils.typeRef
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Service
// fagmodul servie mellom frontend og fagmodul (eessi-pen)
class FagmodulService(val fagmodulRestTemplate: RestTemplate) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulService::class.java) }

    private val FAG_PATH: String = "/api"

    fun landkoder(): List<String> {
        val path = "/landkoder"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity("", HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, typeRef<List<String>>())

        val list = response.body ?: throw IllegalArgumentException("Ingen list over landkoder funnet")
        return list

    }

    fun addsed(frontRequest: FrontendRequest): String {
        val path = "/addsed"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, typeRef<String>())

        val euxCaseID = response.body ?: throw IllegalArgumentException("Ingen EUXcaseid mottatt. feil ved leggetil av SED (eux basis)")
        return euxCaseID
    }

    fun create(frontRequest: FrontendRequest): String {
        logger.debug("create reqeust to fagmodul : $frontRequest")
        val path = "/create"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)

        val euxCaseID = response.body ?: throw IllegalArgumentException("Ingen EUXcaseid mottatt. feil ved opprettelse av SED (eux basis)")
        return euxCaseID
    }

    fun confirm(frontRequest: FrontendRequest): String {
        logger.debug("create reqeust to fagmodul : $frontRequest")
        val path = "/confirm"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)

        val sed = response.body ?: throw IllegalArgumentException("Ingen Json/SED mottatt. Feil ved generering av SED")
        return sed
    }
}