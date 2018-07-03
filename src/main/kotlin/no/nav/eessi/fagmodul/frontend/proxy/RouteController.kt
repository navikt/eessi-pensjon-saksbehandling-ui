package no.nav.eessi.fagmodul.frontend.proxy

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class RouteController {

    @RequestMapping("/**/{path:[^\\.]+}")
    fun forward(): String {
        return "forward:/"
    }
}
