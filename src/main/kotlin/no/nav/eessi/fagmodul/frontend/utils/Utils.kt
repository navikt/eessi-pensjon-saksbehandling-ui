package no.nav.eessi.fagmodul.frontend.utils

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpHeaders
import org.springframework.web.client.RestClientException

class Utils

val logger: Logger by lazy { LoggerFactory.getLogger(Utils::class.java) }

inline fun <reified T : Any> typeRef(): ParameterizedTypeReference<T> = object : ParameterizedTypeReference<T>() {}
inline fun <reified T : Any> typeRefs(): TypeReference<T> = object : TypeReference<T>() {}

/**
 * Sende httpheader til BASSIS token/cookie?
 */
fun createHeaderData(token: String): HttpHeaders {
    val headers = HttpHeaders()
    headers.add(HttpHeaders.COOKIE, "JSESSIONID=$token")
    headers.add(HttpHeaders.CONTENT_TYPE, "application/json;charset=utf-8")
    return headers
}

fun createErrorMessage(responseBody: String?): RestClientException {
    val objectMapper = jacksonObjectMapper()
    logger.error("ErrorMessage (responseBody) : $responseBody")
    return objectMapper.readValue(responseBody, RestClientException::class.java)
}

fun mapAnyToJson(data: Any): String {
    val json = jacksonObjectMapper()
            //.setDefaultPropertyInclusion(JsonInclude.Include.NON_EMPTY)
            .writerWithDefaultPrettyPrinter()
            .writeValueAsString(data)
    return json
}

//fun mapAnyToJson(data: Any, nonempty: Boolean = false): String {
//    if (nonempty) {
//        val json = jacksonObjectMapper()
//                .setDefaultPropertyInclusion(JsonInclude.Include.NON_EMPTY)
//                .writerWithDefaultPrettyPrinter()
//                .writeValueAsString(data)
//        return json
//    } else {
//        return mapAnyToJson(data)
//    }
//}
//
//
//fun validateJson(json: String) : Boolean {
//    try {
//        val objectMapper = ObjectMapper()
//        objectMapper.enable(DeserializationFeature.FAIL_ON_READING_DUP_TREE_KEY)
//        objectMapper.readTree(json)
//        return true
//    } catch (ex: Exception) {
//        println(ex.message)
//    }
//    return false
//}
//
//fun createListOfBuConSector(sector: Sector): List<BUC> {
//    val sectorlist = createSectorList()
//    val buclist : MutableList<BUC> = mutableListOf()
//    sectorlist.forEach {
//        if (it.name == sector.name) {
//            it.buc!!.forEach {
//                buclist.add(it)
//            }
//        }
//    }
//    return buclist.toList()
//}
//
//fun createListOfSEDOnBUC(sector: Sector, buc: BUC): List<SED> {
//    val sectorlist = createSectorList()
//    val sedlist : MutableList<SED> = mutableListOf()
//    sectorlist.forEach {
//        if (it.name == sector.name) {
//            it.buc!!.forEach {
//                if (it.bucType == buc.bucType)
//                    sedlist.addAll(it.sed!!)
//            }
//        }
//    }
//    return sedlist.toList()
//}
//
//fun createListOfSED(): List<SED> {
//    val sectorlist = createSectorList()
//    val sedlist : MutableList<SED> = mutableListOf()
//    sectorlist.forEach {
//        if (it.name == sector.name) {
//            it.buc!!.forEach {
//                if (it.bucType == buc.bucType)
//                    sedlist.addAll(it.sed!!)
//            }
//        }
//    }
//    return sedlist.toList()
//}
