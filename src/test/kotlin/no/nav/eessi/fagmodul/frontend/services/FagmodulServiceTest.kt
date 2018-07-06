package no.nav.eessi.fagmodul.frontend.no.nav.eessi.fagmodul.frontend.services

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.whenever
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.services.EuxServiceTest
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers
import org.mockito.Mock
import org.mockito.junit.MockitoJUnitRunner
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.client.RestTemplate
import kotlin.test.assertNotNull

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




}