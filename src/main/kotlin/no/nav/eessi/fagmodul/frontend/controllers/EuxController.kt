package no.nav.eessi.fagmodul.frontend.controllers

import io.swagger.annotations.ApiOperation
import no.nav.eessi.fagmodul.frontend.models.PDFRequest
import no.nav.eessi.fagmodul.frontend.models.RINASaker
import no.nav.eessi.fagmodul.frontend.models.RINAaksjoner
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import no.nav.freg.security.oidc.common.OidcTokenAuthentication
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.util.regex.Pattern.matches

private val logger = LoggerFactory.getLogger(EuxController::class.java)

@RestController
@RequestMapping("/api")
class EuxController(private val euxService: EuxService, private val fagService: FagmodulService) {

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

    @GetMapping("/case/{caseid}/{actorid}/{rinaid}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun validateCaseNumberWithRinaID(@PathVariable caseid: String, @PathVariable actorid: String, @PathVariable rinaid: String): ResponseEntity<Map<String, String>> {
        if (matches("\\d+", caseid) && matches("\\d+", actorid) && matches("\\d+", rinaid)) {
            return ResponseEntity.ok(mapOf("casenumber" to caseid, "pinid" to actorid, "rinaid" to rinaid))
        }
        return ResponseEntity.badRequest().body(mapOf("serverMessage" to "invalidCase"))
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
        return try {
            euxService.getCachedBuCTypePerSekor()
        } catch (ex: Exception) {
            //ResponseEntity.badRequest().body(mapOf("serverMessage" to ex.message))
            throw ex
        }

    }

    @ApiOperation("henter liste over seds, seds til valgt buc eller seds til valgt rinasak")
    @GetMapping("/seds", "/seds/{buc}", "/sedfromrina/{rinanr}")
    fun getSeds(@PathVariable(value = "buc", required = false) buc: String?, @PathVariable(value = "rinanr", required = false) rinanr: String?): List<String> {
        if (rinanr != null) {
            return euxService.getSedActionFromRina(rinanr)
        }
        return euxService.getAvailableSEDonBuc(buc)
    }

    @ApiOperation("henter ut Buc fra Rinanr")
    @GetMapping("/bucfromrina/{rinanr}")
    fun getBucFromRina(@PathVariable(value = "rinanr", required = true) rinanr: String): String {
        return euxService.getBucFromRina(rinanr)
    }


    @ApiOperation("henter opp mulige aksjoner som kan utføres på valgt rinacase, filtert på sed starter med 'P'")
    @GetMapping("/aksjoner/{rinanr}", "/aksjoner/{rinanr}/{filter}")
    fun getMuligeAksjoner(@PathVariable(value = "rinanr", required = true) rinanr: String, @PathVariable(value = "filter", required = false) filter: String? = null): List<RINAaksjoner> {
        val list = euxService.getMuligeAksjoner(rinanr)
        if (filter == null) {
            return getMuligeAksjonerFilter(list)
        }
        return getMuligeAksjonerFilter(list, filter)
    }

    private fun getMuligeAksjonerFilter(list: List<RINAaksjoner>, filter: String = ""): List<RINAaksjoner> {
        val filterlist = mutableListOf<RINAaksjoner>()
        println("list: $list")
        list.forEach {
            println("it: $it")
            if (it.dokumentType != null && it.dokumentType.startsWith(filter)) {
                filterlist.add(it)
            }
        }
        return filterlist.toList()
    }

    @ApiOperation("Henter lisgte over rina mot fnr")
    @GetMapping("/rinasaker/{fnr}")
    fun getRinaSaker(@PathVariable(value = "fnr", required = true) fnr: String): List<RINASaker> {
        return euxService.getRinaSaker("", fnr)
    }

    @ApiOperation("henter liste av alle tilgjengelige instusjoner fra EUX")
    @GetMapping("/institutions")
    fun getInstitutions(): List<String> {
        return euxService.getCachedInstitusjoner()
    }

    @GetMapping("/institutions/{countrycode}")
    fun getInstitutionsWithCountry(@PathVariable(value = "countrycode", required = false) landkode: String = ""): List<String> {
        return euxService.getInstitusjoner("", landkode)
    }

    @GetMapping("/countrycode")
    fun getCountryCode(): List<String> {
        return try {
            fagService.landkoder().filter { s -> s == "NO" } // TODO: Using "NO" temporarily to avoid sending documents to other countries in test by accident
        } catch (ex: Exception) {
            logger.error(ex.message)
            listOf("NO", "SE", "DK", "FI")
        }
    }

    @GetMapping("/subjectarea")
    fun getSubjectArea(): List<String> {
        return listOf("Pensjon", "Andre")
    }

    @GetMapping("/userinfo")
    fun getUserInfo(): String {
        val auth = SecurityContextHolder.getContext().authentication as OidcTokenAuthentication
        return auth.principal
    }
}


