package no.nav.eessi.fagmodul.frontend.controllers

import io.swagger.annotations.ApiOperation
import no.nav.eessi.fagmodul.frontend.models.ErrorResponse
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.models.IkkeGyldigKallException
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*
import kotlin.math.log

@RestController
@RequestMapping("/fag")
class FagmodulController(private val service: FagmodulService) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulController::class.java) }

    @ApiOperation("kjører prosess OpprettBuCogSED på EUX for å få dokuemt opprett i Rina")
    @PostMapping("/create")
    fun createDocument(@RequestBody request: FrontendRequest): String {
        logger.debug("Create: request model : $request")
        try {
            return service.create(request)
        } catch (ex: Exception) {
            logger.error(ex.message, ex)
            throw ex
        }
    }

    @ApiOperation("kjører prosess Confirm for valgt SED før create. kan så validere korrekt data før Create.")
    @PostMapping("/confirm")
    fun confirmDocument(@RequestBody request: FrontendRequest): String {
        logger.debug("Confirm: request model : $request")
        try {
            return service.confirm(request)
        } catch (ex: Exception) {
            logger.error(ex.message, ex)
            throw ex
        }
    }

    @ApiOperation("legge til SED på et eksisterende Rina document. kjører preutfylling")
    @PostMapping("/addsed")
    fun addDocument(@RequestBody request: FrontendRequest): String {
        logger.debug("Addsed: request model : $request")
        return service.addsed(request)
    }

    @ApiOperation("sendSed send current sed")
    @PostMapping("/sendsed")
    fun sendSed(@RequestBody request: FrontendRequest): Boolean {
        logger.debug("sendSed: request model : $request")
        return service.sendsed(request)
    }


}
