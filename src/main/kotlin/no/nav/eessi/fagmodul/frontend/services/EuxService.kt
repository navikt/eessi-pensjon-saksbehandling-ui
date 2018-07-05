package no.nav.eessi.fagmodul.frontend.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.google.common.cache.CacheBuilder
import com.google.common.cache.CacheLoader
import com.google.common.collect.Lists
import com.google.common.collect.Sets
import no.nav.eessi.eessifagmodul.utils.createErrorMessage
import no.nav.eessi.eessifagmodul.utils.typeRef
import no.nav.eessi.eessifagmodul.utils.typeRefs
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Description
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.io.IOException
import java.util.concurrent.TimeUnit


@Service
@Description("Service class for EuxBasis - EuxCpiServiceController.java")
class EuxService(val euxRestTemplate: RestTemplate) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(EuxService::class.java) }

    private val EUX_PATH: String = "/cpi"

    private val objectMapper = jacksonObjectMapper()

    //testing only
    var overrideheaders: Boolean? = null

    private val buccache = CacheBuilder.newBuilder()
            .expireAfterAccess(2, TimeUnit.HOURS)
            .recordStats()
            .build(object : CacheLoader<Any, List<String>>() {
                @Throws(IOException::class)
                override fun load(s: Any): List<String> {
                    return getBuCtypePerSektor()
                }
            })

    private val instituitioncache = CacheBuilder.newBuilder()
            .expireAfterAccess(2, TimeUnit.HOURS)
            .recordStats()
            .build(object : CacheLoader<Any, List<String>>() {
                @Throws(IOException::class)
                override fun load(s: Any): List<String> {
                    val result = getInstitusjoner()
                    return result.sortedWith(compareBy({it},{it }))
                }
            })

    //reload cache
    fun refreshAll() {
        try {
            instituitioncache.refresh("")
            logger.debug("instituitioncache refresh")
            buccache.refresh("")
            logger.debug("buccache refresh")
        } catch (ex: Exception) {
            logger.error("Something went wrong cache")
        }
    }

    fun getCachedBuCTypePerSekor(): List<String> {
        return buccache.get("")
    }

    fun getBuCtypePerSektor(): List<String> {
        val urlPath = "/BuCTypePerSektor"

        val headers = logonBasis()
        val httpEntity = HttpEntity("", headers)
        val response = euxRestTemplate.exchange("$EUX_PATH$urlPath", HttpMethod.GET, httpEntity, typeRef<String>())
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return objectMapper.readValue(responseBody, typeRefs<List<String>>())
            }
        } catch (ex: IOException) {
            throw RuntimeException(ex.message)
        }
    }

//    //henter ut status på rina.
//    fun getRinaSaker(bucType: String = "",rinaNummer: String? = ""): List<RINASaker> {
//        val urlPath = "/RINASaker"
//
//        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
//                .queryParam("BuCType", bucType)
//                .queryParam("RINASaksnummer", rinaNummer)
//
//        val headers = logonBasis()
//
//        val httpEntity = HttpEntity("", headers)
//        val response = oidcRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String::class.java)
//        val responseBody = response.body!!
//        try {
//            if (response.statusCode.isError) {
//                throw createErrorMessage(responseBody)
//            } else {
//                return objectMapper.readValue(responseBody, typeRefs<List<RINASaker>>())
//            }
//        } catch (ex: IOException) {
//            throw RuntimeException(ex.message)
//        }
//    }

    //Henter en liste over tilgjengelige aksjoner for den aktuelle RINA saken PK-51365"
    fun getMuligeAksjoner(euSaksnr: String): String {
        val urlPath = "/MuligeAksjoner"

        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
                .queryParam("RINASaksnummer", euSaksnr)

        val headers = logonBasis()
        val httpEntity = HttpEntity("", headers)

        val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, typeRef<String>())
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return responseBody // objectMapper.readValue(responseBody, typeRefs<String>())
            }
        } catch (ex: IOException) {
            throw RuntimeException(ex.message)
        }
    }

    //Cached list of Institusjoner..
    fun getCachedInstitusjoner(): List<String> {
        val result = instituitioncache.get("")
        return result
    }

    //PK-51002 --
    //Henter ut en liste over registrerte institusjoner innenfor spesifiserte EU-land. PK-51002"
    fun getInstitusjoner(bucType: String = "", landKode: String = ""): List<String> {
        val urlPath = "/Institusjoner"

        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
                .queryParam("BuCType", bucType)
                .queryParam("LandKode", landKode)

        val headers = logonBasis()
        val httpEntity = HttpEntity("", headers)

        val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, typeRef<String>())
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return objectMapper.readValue(responseBody, typeRefs<List<String>>())
            }
        } catch (ex: IOException) {
            throw RuntimeException()
        }
    }

    //Own impl. no list from eux that contains list of sed to a speific buc
    fun getAvailableSEDonBuc(buc: String?): List<String> {
        val list1 = listOf("P2000","P2200")
        val list2 = listOf("P6000","P10000")
        val list3 = listOf("P5000")

        val map : Map<String, List<String>> =
                mapOf(
                        "P_BUC_01" to list1,
                        "P_BUC_06" to list2,
                        "P_BUC_07" to list3
                )
        if (buc.isNullOrEmpty()) {
            val set: MutableSet<String> = Sets.newHashSet()
            set.addAll(list1)
            set.addAll(list2)
            set.addAll(list3)
            return Lists.newArrayList(set)
        }

        val result = map.get(buc).orEmpty()
        return result
    }

    //temp fuction to log system onto eux basis
    fun logonBasis(): HttpHeaders {
        logger.debug("overrideheaders : $overrideheaders")
        if (overrideheaders !== null && overrideheaders!! == true) {
            return HttpHeaders()
        }
        val urlPath = "/login"
        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
                .queryParam("username", "T102")
                .queryParam("password", "rina@nav")
//                .queryParam("username", "srvPensjon")
//                .queryParam("password", "Ash5SoxP")

        val httpEntity = HttpEntity("", HttpHeaders())
        val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.POST, httpEntity, String::class.java)
        val header = response.headers

        val cookies = HttpHeaders()
        cookies.set("Cookie", header.getFirst(HttpHeaders.SET_COOKIE))
        logger.debug("setting request cookie : ${header.getFirst(HttpHeaders.SET_COOKIE)}")
        cookies.set("X-XSRF-TOKEN", header.getFirst("X-XSRF-TOKEN"))
        logger.debug("setting request X-XSRF-TOKEN : ${header.getFirst("X-XSRF-TOKEN")}")
        return cookies
    }

}
