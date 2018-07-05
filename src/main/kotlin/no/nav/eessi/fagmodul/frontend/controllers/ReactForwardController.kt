package no.nav.eessi.fagmodul.frontend.controllers

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class ForwardController {

    @RequestMapping("/react/*")
    fun index(): String {
        println("forwarding to index.html")
        return "forward:/index.html"
    }
}
