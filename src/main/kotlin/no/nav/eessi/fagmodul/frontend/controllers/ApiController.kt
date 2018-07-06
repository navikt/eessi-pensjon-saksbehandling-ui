package no.nav.eessi.fagmodul.frontend.controllers

import io.swagger.annotations.ApiOperation
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.bind.annotation.RequestMapping
import java.util.regex.Pattern.matches

@RestController
@RequestMapping("/api")
class ApiController(private val euxService: EuxService) {

    @Value("\${rina.url}")
    lateinit var rinaUrl: String

    @GetMapping("/refreshAll")
    fun refreshAll() {
        euxService.refreshAll()
    }

    @GetMapping("/rinaurl")
    fun getRinaURL(): String {
        return rinaUrl
    }

    @GetMapping("/case/{casenumber}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun validateCaseNumber(@PathVariable casenumber: String): ResponseEntity<Map<String, String>> {
        if (matches("\\d+", casenumber)) {
            return ResponseEntity.ok(mapOf("casenumber" to casenumber))
        }
        return ResponseEntity.badRequest().body(mapOf("serverMessage" to "asdfvalidCaseNumber"))
    }

    @ApiOperation("henter liste av alle tilgjengelige BuC fra EUX")
    @GetMapping("/bucs", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getBucs(): List<String> {
        return euxService.getCachedBuCTypePerSekor()
    }

    @GetMapping("/seds", "/seds/{buc}")
    fun getSeds(@PathVariable(value = "buc", required = false) buc: String?): List<String> {
        return euxService.getAvailableSEDonBuc(buc)
    }

    @ApiOperation("henter liste av alle tilgjengelige instusjoner fra EUX")
    @GetMapping("/institutions")
    fun getInstitutions(): List<String> {
        return euxService.getCachedInstitusjoner()
    }

    @GetMapping("/institutions/{countrycode}")
    fun getInstitutionsWithCountry(@PathVariable(value = "countrycode", required = false) landkode: String = ""): List<String> {
        return euxService.getInstitusjoner("",landkode)
    }

    @GetMapping("/countrycode")
    fun getCountryCode() : List<String> {
        return listOf("NO","SE","DK","FI")
    }

    @GetMapping("/subjectarea")
    fun getSubjectArea() : List<String> {
        return listOf("Pensjon")
    }

}


