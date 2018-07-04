package no.nav.eessi.fagmodul.frontend.controllers

import com.fasterxml.jackson.core.type.TypeReference
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.*
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
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
        return ResponseEntity.badRequest().body(mapOf("serverMessage" to "invalidCaseNumber"))
    }

    @GetMapping("/institutions", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getInstitutions(@CookieValue("id-token") idToken: Cookie): ResponseEntity<List<String>> {
        val headers = HttpHeaders()
        headers.add(HttpHeaders.AUTHORIZATION, "Bearer ${idToken.value}")
        return fagmodulRestTemplate.exchange("/api/institutions", HttpMethod.GET, HttpEntity<Unit>(headers), typeRefs<List<String>>())
    }
}

inline fun <reified T : Any> typeRefs(): TypeReference<T> = object : TypeReference<T>() {}
