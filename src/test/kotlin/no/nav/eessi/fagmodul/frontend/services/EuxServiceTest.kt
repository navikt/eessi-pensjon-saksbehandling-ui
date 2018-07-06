package no.nav.eessi.fagmodul.frontend.services

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.eq
import com.nhaarman.mockito_kotlin.whenever
import no.nav.eessi.fagmodul.frontend.utils.typeRef
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.Mock
import org.mockito.junit.MockitoJUnitRunner
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate
import kotlin.test.assertTrue

@RunWith(MockitoJUnitRunner::class)
class EuxServiceTest {

    private val logger: Logger by lazy { LoggerFactory.getLogger(EuxServiceTest::class.java) }

    lateinit var service: EuxService

    private val objMapper = jacksonObjectMapper()

    @Mock
    private lateinit var mockrestTemplate: RestTemplate


    @Before
    fun setup() {
        logger.debug("Starting tests.... ...")
        objMapper.enable(SerializationFeature.WRAP_ROOT_VALUE)
        service = EuxService(mockrestTemplate)
        //skip eux basis login (onlu for mock)
        service.overrideheaders = true

    }

    @Test
    fun `get a list of Buc pr sector`() {
        val mockData = "[\"P_BUC_01\",\"P_BUC_07\",\"P_BUC_02\",\"P_BUC_05\",\"P_BUC_06\",\"P_BUC_09\"]"
        val mockResponse = ResponseEntity(mockData, HttpStatus.OK)
        whenever(mockrestTemplate.exchange(anyString(), eq(HttpMethod.GET), any(), eq(typeRef<String>()))).thenReturn(mockResponse)
        val data: List<String> = service.getBuCtypePerSektor()

        assertNotNull(data)
        assertEquals(6, data.size)
    }

    @Test
    fun `check for list of institusions`() {
        val expected = "[\"NO:NAV02\",\"NO:DUMMY\"]"
        val mockResponse = ResponseEntity(expected, HttpStatus.OK)
        whenever(mockrestTemplate.exchange(anyString(), eq(HttpMethod.GET), any(), eq(typeRef<String>()))).thenReturn(mockResponse)
        //val response = euxRestTemplate.exchange(builder.toUriString(), HttpMethod.GET, httpEntity, typeRef<String>())

        val data = service.getInstitusjoner("P_BUC_01", "NO")
        assertNotNull(data)
        assertEquals(2, data.size)
        assertEquals("NO:NAV02", data.get(0))
    }

    //@Ignore("Not yet implemented")
    @Test
    fun `check for mulige aksjoner on rinacaseid`() {
        val bucType = "FB_BUC_01"

        val data = "[" +
                "{\"navn\":\"Create\"," +
                "\"id\":\"312430_f54d4c4ea29840a3bd8404ec08ffd29f\",\n" +
                "\"kategori\":\"Documents\",\n" +
                "\"dokumentType\":\"P2000\"," +
                "\"dokumentId\":\"602982a0a84d4fe6aaf46a61b30a3a2e\"}]"
        val response: ResponseEntity<String> = ResponseEntity(data, HttpStatus.OK)
        whenever(mockrestTemplate.exchange(anyString(),eq(HttpMethod.GET), any(), eq(typeRef<String>()))).thenReturn(response)

        val resultat = service.getMuligeAksjoner(bucType)

        assertNotNull(resultat)
        assertTrue(resultat.contains("P2000"))
        assertTrue("Skal komme hit", true)
    }

    @Test
    fun getAvailableSEDTypes() {
        val bucType = "P_BUC_06"
        val resultat = service.getAvailableSEDonBuc(bucType)
        assertNotNull(resultat)
        assertEquals("P6000", resultat.get(0))
        assertEquals("P10000", resultat.get(1))
    }

}

