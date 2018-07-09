package no.nav.eessi.fagmodul.frontend.no.nav.eessi.fagmodul.frontend.services

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.whenever
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.services.EuxServiceTest
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import no.nav.eessi.fagmodul.frontend.utils.typeRef
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers
import org.mockito.Mock
import org.mockito.junit.MockitoJUnitRunner
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.expect

@RunWith(MockitoJUnitRunner::class)
class FagmodulServiceTest {

    private val logger: Logger by lazy { LoggerFactory.getLogger(FagmodulServiceTest::class.java) }

    lateinit var service: FagmodulService

    private val objMapper = jacksonObjectMapper()

    @Mock
    private lateinit var mockrestTemplate: RestTemplate


    @Before
    fun setup() {
        logger.debug("Starting tests.... ...")
        objMapper.enable(SerializationFeature.WRAP_ROOT_VALUE)
        service = FagmodulService(mockrestTemplate)
        //skip eux basis login (onlu for mock)
    }

    @Test
    fun `create buc and sed post to fagmodul`() {

        val response = ResponseEntity("12345678", HttpStatus.OK)
        whenever(mockrestTemplate.exchange(ArgumentMatchers.anyString(), eq(HttpMethod.POST), any(), eq(String::class.java))).thenReturn(response)

        val euxservicenr = service.create(FrontendRequest())
        assertNotNull(euxservicenr)
        assertEquals("12345678", euxservicenr)
    }


}