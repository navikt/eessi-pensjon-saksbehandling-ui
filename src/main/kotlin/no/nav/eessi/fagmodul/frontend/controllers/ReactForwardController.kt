package no.nav.eessi.fagmodul.frontend.controllers

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/_")
class ForwardController {

    @RequestMapping("/*")
    fun index(): String {
        println("forwarding to index.html")
        return "forward:/index.html"
    }
}
