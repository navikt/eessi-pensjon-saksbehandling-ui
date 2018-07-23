package no.nav.eessi.fagmodul.frontend.controllers

import io.swagger.annotations.ApiOperation
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.models.TrygdeTid
import no.nav.eessi.fagmodul.frontend.models.createTrygdeTidMock
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/fag")
class FagmodulController(private val service: FagmodulService) {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulController::class.java) }

    @ApiOperation("kjører prosess OpprettBuCogSED på EUX for å få dokuemt opprett i Rina")
    @PostMapping("/create")
    fun createDocument(@RequestBody request: FrontendRequest): String? {
        logger.debug("request model : $request")
            return service.create(request)
    }

    @ApiOperation("kjører prosess OpprettBuCogSED på EUX for å få dokuemt opprett i Rina")
    @PostMapping("/confirm")
    fun confirmDocument(@RequestBody request: FrontendRequest): String? {
        logger.debug("request model : $request")
        return service.confirm(request)
    }

    @ApiOperation("Henter opp mock av TrygdeTid")
    @PostMapping("/trygdetid")
    fun trygdetid(): TrygdeTid {
        return createTrygdeTidMock()
    }

}
