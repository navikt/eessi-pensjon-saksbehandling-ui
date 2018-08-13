package no.nav.eessi.fagmodul.frontend.controllers

import io.swagger.annotations.ApiOperation
import no.nav.eessi.fagmodul.frontend.models.PDFRequest
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import no.nav.eessi.fagmodul.frontend.utils.logger
import no.nav.freg.security.oidc.common.OidcTokenAuthentication
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.util.regex.Pattern.matches

@RestController
@RequestMapping("/api")
class ApiController(private val euxService: EuxService, private val fagService: FagmodulService) {

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

    @GetMapping("/case/{caseid}/{actorid}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun validateCaseNumber(@PathVariable caseid: String, @PathVariable actorid: String): ResponseEntity<Map<String, String>> {
        if (matches("\\d+", caseid) && matches("\\d+", actorid)) {
            return ResponseEntity.ok(mapOf("casenumber" to caseid, "pinid" to actorid))
        }
        return ResponseEntity.badRequest().body(mapOf("serverMessage" to "invalidCase"))
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
        try {
            return fagService.landkoder()
        } catch (ex: Exception) {
            logger.error(ex.message)
            return listOf("NO","SE","DK","FI")
        }
    }

    @GetMapping("/subjectarea")
    fun getSubjectArea() : List<String> {
        return listOf("Pensjon")
    }

    @GetMapping("/userinfo")
    fun getUserInfo(): String {
        val auth = SecurityContextHolder.getContext().authentication as OidcTokenAuthentication
        return auth.principal
    }

    @PostMapping("/generatePDF")
    fun generatePDF(@RequestBody request: PDFRequest): ResponseEntity<Map<String, Map<String, Any>>> {
        logger.debug(request.toString());

        return ResponseEntity.ok(mapOf(
                "work" to mapOf(
                        "base64" to request?.pdfs?.get(0)?.base64,
                        "name" to "work.pdf",
                        "size" to request?.pdfs?.get(0)?.size,
                        "numPages" to request?.pdfs?.get(0)?.numPages
                ),
                "home" to mapOf(
                        "base64" to request?.pdfs?.get(0)?.base64,
                        "name" to "home.pdf",
                        "size" to request?.pdfs?.get(0)?.size,
                        "numPages" to request?.pdfs?.get(0)?.numPages
                ),
                "sick" to mapOf(
                        "base64" to request?.pdfs?.get(0)?.base64,
                        "name" to "sick.pdf",
                        "size" to request?.pdfs?.get(0)?.size,
                        "numPages" to request?.pdfs?.get(0)?.numPages
                ),
                "other" to mapOf(
                        "base64" to request?.pdfs?.get(0)?.base64,
                        "name" to "other.pdf",
                        "size" to request?.pdfs?.get(0)?.size,
                        "numPages" to request?.pdfs?.get(0)?.numPages
                )
        ));
    }
}


