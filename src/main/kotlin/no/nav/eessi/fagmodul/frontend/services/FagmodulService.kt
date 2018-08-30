package no.nav.eessi.fagmodul.frontend.services

import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.models.SedDokumentIkkeOpprettetException
import no.nav.eessi.fagmodul.frontend.utils.createErrorMessage
import no.nav.eessi.fagmodul.frontend.utils.mapJsonToAny
import no.nav.eessi.fagmodul.frontend.utils.typeRef
import no.nav.eessi.fagmodul.frontend.utils.typeRefs
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.io.IOException
import java.util.Collections.singletonMap
import org.springframework.web.util.UriComponents
import java.util.*


private const val FAG_PATH = "/api"

@Service
class FagmodulService(val fagmodulRestTemplate: RestTemplate) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulService::class.java) }

    fun landkoder(): List<String> {
        val path = "/landkoder"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity("", HttpHeaders())

        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, typeRef<List<String>>())

        return response.body ?: throw IllegalArgumentException("Ingen list over landkoder funnet")
    }

    fun addsed(frontRequest: FrontendRequest): String {
        val path = "/sed/add"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        return try {
            val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, typeRef<String>())
            val euxCaseID = response.body ?: throw IllegalArgumentException("Ingen EUXcaseid mottatt. feil ved leggetil av SED (eux basis)")
            euxCaseID
        } catch (ex: Exception) {
            throw ex
        }
    }

    fun create(frontRequest: FrontendRequest): String {
        logger.debug("create reqeust to fagmodul : $frontRequest")
        val path = "/buc/create"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        return try {
            val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)
            val euxCaseID = response.body ?: throw IllegalArgumentException("Ingen EUXcaseid mottatt. feil ved opprettelse av SED (eux basis)")
            euxCaseID
        } catch (ex: Exception) {
            throw ex
        }
    }

    fun confirm(frontRequest: FrontendRequest): String {
        logger.debug("create reqeust to fagmodul : $frontRequest")
        val path = "/sed/confirm"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        return try {
            val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)
            val euxCaseID = response.body ?: throw SedDokumentIkkeOpprettetException("Ingen RINANR mottatt. feil ved opprett ny SED")
            euxCaseID
        } catch (ex: Exception) {
            logger.error(ex.message, ex)
            throw ex
        }
    }

    fun fetchSEDfromExistingRinaCase(euxCaseId: String, documentId: String): String {
        val path = "/sed/get/{rinanr}/{documentid}"

        val uriParams = HashMap<String, String>()
        uriParams["rinanr"] = euxCaseId
        uriParams["documentid"] = documentId

        val builder = UriComponentsBuilder.fromUriString(path).buildAndExpand(uriParams)

        val httpEntity = HttpEntity("")
        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String::class.java)
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return responseBody
            }
        } catch (ex: IOException) {
            throw RuntimeException(ex.message)
        }

    }

    fun deleteSEDfromExistingRinaCase(euxCaseId: String, sed: String, documentId: String): HttpStatus {
        val path = "/sed/get/{rinanr}/{sed}/{documentid}"

        val uriParams = HashMap<String, String>()
        uriParams["rinanr"] = euxCaseId
        uriParams["sed"] = sed
        uriParams["documentid"] = documentId

        val builder = UriComponentsBuilder.fromUriString(path).buildAndExpand(uriParams)
        val httpEntity = HttpEntity("")
        val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String::class.java)
        return response.statusCode

    }

    fun sendsed(frontRequest: FrontendRequest): Boolean {
        val path = "/sed/send"

        val builder = UriComponentsBuilder.fromPath("$FAG_PATH$path")
        val httpEntity = HttpEntity(frontRequest, HttpHeaders())

        return try {
            val response = fagmodulRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, typeRef<Boolean>())
            val result = response.body ?: throw IllegalArgumentException("Ingen RINANR mottatt, feil ved send sed")
            result
        } catch (ex: Exception) {
            logger.error(ex.message, ex)
            throw ex
        }
    }
}