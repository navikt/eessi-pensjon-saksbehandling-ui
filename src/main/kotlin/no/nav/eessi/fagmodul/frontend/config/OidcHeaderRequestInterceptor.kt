package no.nav.eessi.fagmodul.frontend.config

import no.nav.freg.security.oidc.common.OidcTokenAuthentication
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse
import org.springframework.security.core.context.SecurityContextHolder

class OidcHeaderRequestInterceptor : ClientHttpRequestInterceptor {

    private val logger: Logger by lazy { LoggerFactory.getLogger(OidcHeaderRequestInterceptor::class.java) }

    override fun intercept(request: HttpRequest, body: ByteArray, execution: ClientHttpRequestExecution): ClientHttpResponse {
        if (request.headers[HttpHeaders.AUTHORIZATION] == null) {
            logger.debug("Adding authorization header with bearer-token to request")
            val authentication = SecurityContextHolder.getContext().authentication as OidcTokenAuthentication
            logger.debug("\tPrincipal: ${authentication.principal}")
            request.headers.add(HttpHeaders.AUTHORIZATION, "Bearer ${authentication.idToken}")
        }
        return execution.execute(request, body)
    }
}
