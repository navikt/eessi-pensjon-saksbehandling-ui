package no.nav.eessi.fagmodul.frontend.services

import com.google.common.cache.CacheBuilder
import com.google.common.cache.CacheLoader
import com.google.common.collect.Sets
import no.nav.eessi.fagmodul.frontend.models.RINASaker
import no.nav.eessi.fagmodul.frontend.models.RINAaksjoner
import no.nav.eessi.fagmodul.frontend.utils.createErrorMessage
import no.nav.eessi.fagmodul.frontend.utils.mapJsonToAny
import no.nav.eessi.fagmodul.frontend.utils.typeRef
import no.nav.eessi.fagmodul.frontend.utils.typeRefs
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Description
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder
import java.io.IOException
import java.util.concurrent.TimeUnit

private const val EUX_PATH: String = "/cpi"
private val logger = LoggerFactory.getLogger(EuxService::class.java)

@Service
@Description("Service class for EuxBasis - EuxCpiServiceController.java")
class EuxService(val euxRestTemplate: RestTemplate) {

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
                    return result.sortedWith(compareBy({ it }, { it }))
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

        val httpEntity = HttpEntity("")
        val response = euxRestTemplate.exchange("$EUX_PATH$urlPath", HttpMethod.GET, httpEntity, typeRef<String>())
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return mapJsonToAny(responseBody, typeRefs())
            }
        } catch (ex: IOException) {
            throw RuntimeException(ex.message)
        }
    }

    //Cached list of Institusjoner..
    fun getCachedInstitusjoner(): List<String> {
        return instituitioncache.get("")
    }

    //PK-51002 --
    //Henter ut en liste over registrerte institusjoner innenfor spesifiserte EU-land. PK-51002"
    fun getInstitusjoner(bucType: String = "", landKode: String = ""): List<String> {
        val urlPath = "/Institusjoner"

        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
                .queryParam("BuCType", bucType)
                .queryParam("LandKode", landKode)

        val httpEntity = HttpEntity("")

        val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, typeRef<String>())
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return mapJsonToAny(responseBody, typeRefs())
            }
        } catch (ex: IOException) {
            throw RuntimeException()
        }
    }

    //Henter en liste over tilgjengelige aksjoner for den aktuelle RINA saken PK-51365"
    fun getMuligeAksjoner(euSaksnr: String): List<RINAaksjoner> {
        val urlPath = "/MuligeAksjoner"

        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
                .queryParam("RINASaksnummer", euSaksnr)

        val httpEntity = HttpEntity("")

        val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, typeRef<String>())
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return mapJsonToAny(responseBody, typeRefs())
            }
        } catch (ex: IOException) {
            throw RuntimeException(ex.message)
        }
    }

    fun getSedActionFromRina(rinanr: String): List<String> {
        val list = getMuligeAksjoner(rinanr)

        val seds = mutableListOf<String>()
        list.forEach {
            if (it.navn == "Create" && it.dokumentType != null && it.dokumentType.startsWith("")) {
                seds.add(it.dokumentType)
            }
        }
        return seds
    }

    fun getBucFromRina(rinanr: String): String {
        val result = getRinaSaker(rinanr, "")
        result.forEach {
            if (it.id == rinanr) {
                return it.traits?.flowType ?: ""
            }
        }
        return ""
    }

    //henter ut status på rina.
    fun getRinaSaker(rinaNummer: String = "", fnr: String = ""): List<RINASaker> {
        val urlPath = "/RINASaker"

        val builder = UriComponentsBuilder.fromPath("$EUX_PATH$urlPath")
                .queryParam("BuCType", "")
                .queryParam("Fødselsnummer", fnr)
                .queryParam("RINASaksnummer", rinaNummer)


        val httpEntity = HttpEntity("")
        val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, String::class.java)
        val responseBody = response.body!!
        try {
            if (response.statusCode.isError) {
                throw createErrorMessage(responseBody)
            } else {
                return mapJsonToAny(responseBody, typeRefs())
            }
        } catch (ex: IOException) {
            throw RuntimeException(ex.message)
        }
    }

    //Own impl. no list from eux that contains list of sed to a speific buc
    fun getAvailableSEDonBuc(buc: String?): List<String> {
        val list1 = listOf("P2000")
        val list2 = listOf("P2100")
        val list3 = listOf("P2200")
        val list4 = listOf("")
        val list5 = listOf("P4000", "P5000", "P6000", "P3000_NO")

        val map: Map<String, List<String>> =
                mapOf(
                        "P_BUC_01" to list1,
                        "P_BUC_02" to list2,
                        "P_BUC_03" to list3,
                        "P_BUC_05" to list4,
                        "P_BUC_06" to list5
                )
        if (buc.isNullOrEmpty()) {
            val set: MutableSet<String> = Sets.newHashSet()
            set.addAll(list1)
            set.addAll(list2)
            set.addAll(list3)
            set.addAll(list4)
            set.addAll(list5)
            return set.toList()
        }
        return map[buc].orEmpty()
    }
}
