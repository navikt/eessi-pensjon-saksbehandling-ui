package no.nav.eessi.fagmodul.frontend.controllers

import com.fasterxml.jackson.core.type.TypeReference
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForEntity
import java.util.regex.Pattern.matches
import javax.servlet.http.Cookie

@RestController
@RequestMapping("/api")
class ApiController {

    @Autowired
    lateinit var fagmodulRestTemplate: RestTemplate

    @Autowired
    lateinit var euxRestTemplate: RestTemplate

    @GetMapping("/case/{casenumber}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun validateCaseNumber(@PathVariable casenumber: String): ResponseEntity<Map<String, String>> {
        if (matches("\\d+", casenumber)) {
            return ResponseEntity.ok(mapOf("casenumber" to casenumber))
        }
        return ResponseEntity.badRequest().body(mapOf("serverMessage" to "asdfvalidCaseNumber"))
    }

    @GetMapping("/institutions", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getInstitutions(@CookieValue("id-token") idToken: Cookie): ResponseEntity<List<String>> {
        return fagmodulRestTemplate.getForEntity("/api/institutions", typeRefs<List<String>>())
    }
}

inline fun <reified T : Any> typeRefs(): TypeReference<T> = object : TypeReference<T>() {}
