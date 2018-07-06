package no.nav.eessi.fagmodul.frontend.no.nav.eessi.fagmodul.frontend.controllers

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.whenever
import no.nav.eessi.fagmodul.frontend.controllers.ApiController
import no.nav.eessi.fagmodul.frontend.controllers.FagmodulController
import no.nav.eessi.fagmodul.frontend.models.FrontendRequest
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.Mock
import org.mockito.junit.MockitoJUnitRunner
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@RunWith(MockitoJUnitRunner::class)
class FagmodulControllerTest {

    @Mock
    lateinit var mockFagmodulService: FagmodulService

    lateinit var fagModulController: FagmodulController

    @Before
    fun setUp() {
        fagModulController = FagmodulController(mockFagmodulService)
    }

    @Test
    fun `create frontend request`() {
        val json = "{\"institutions\":[{\"country\":\"NO\",\"institution\":\"DUMMY\"}]," +
                "\"buc\":\"P_BUC_06\",\"sed\":\"P6000\",\"caseId\":\"caseId\",\"subjectArea\":\"Pensjon\"}"
        //map json request back to FrontendRequest obj
        val map = jacksonObjectMapper()
        val req = map.readValue(json, FrontendRequest::class.java)
        assertNotNull(req)
        assertEquals("P_BUC_06",req.buc)
        assertEquals("DUMMY", req.institutions!![0].institution)
        assertEquals("Pensjon", req.subjectArea)
    }

    @Test
    fun `create and get rinanr back from fagmodul`() {
        val json = "{\"institutions\":[{\"country\":\"NO\",\"institution\":\"DUMMY\"}]," +
                "\"buc\":\"P_BUC_06\",\"sed\":\"P6000\",\"caseId\":\"caseId\",\"subjectArea\":\"Pensjon\"}"
        //map json request back to FrontendRequest obj
        val map = jacksonObjectMapper()
        val mockResponse = map.readValue(json, FrontendRequest::class.java)
        assertNotNull(mockResponse)

        whenever(mockFagmodulService.create(any())).thenReturn("123456")

        val response =  fagModulController.createDocument(mockResponse)
        assertNotNull(response)
        assertEquals("123456",response)
    }



}
