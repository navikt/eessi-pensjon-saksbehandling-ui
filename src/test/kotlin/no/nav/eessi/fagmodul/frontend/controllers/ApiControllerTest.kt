package no.nav.eessi.fagmodul.frontend.controllers

import com.nhaarman.mockito_kotlin.whenever
import no.nav.eessi.fagmodul.frontend.models.RINAaksjoner
import no.nav.eessi.fagmodul.frontend.services.EuxService
import no.nav.eessi.fagmodul.frontend.services.FagmodulService
import org.junit.Assert
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers
import org.mockito.Mock
import org.mockito.junit.MockitoJUnitRunner
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

@RunWith(MockitoJUnitRunner::class)
class ApiControllerTest {

    @Mock
    lateinit var mockEuxService: EuxService

    @Mock
    lateinit var mockFagService: FagmodulService

    lateinit var apiController: EuxController

    @Before
    fun setUp() {
        apiController = EuxController(mockEuxService, mockFagService)
    }


    @Test
    fun `check that cached getBucs() returns a list of buc-names`() {
        val mockData = listOf(
                "P_BUC_01",
                "P_BUC_02",
                "P_BUC_05",
                "P_BUC_06",
                "P_BUC_07")
        whenever(mockEuxService.getCachedBuCTypePerSekor()).thenReturn(mockData)

        val response = apiController.getBucs()

        Assert.assertEquals(mockData.size, response.size)
        Assert.assertTrue(response.containsAll(mockData))
    }

    @Test
    fun `get all SED-types`() {
        val mockData = listOf(
                "P2000",
                "P2200",
                "P5000")
        //whenever(mockEuxService.getAvailableSEDTypes("")).thenReturn(mockData)
        whenever(mockEuxService.getAvailableSEDonBuc("")).thenReturn(mockData)

        val response = apiController.getSeds("", null)

        assertEquals(response.size, mockData.size)
        assertTrue(response.containsAll(mockData))
    }

    @Test
    fun `get all SED-types for specific BUC`() {
        val mockData = listOf(
                "P2000",
                "P2200"
        )
        whenever(mockEuxService.getAvailableSEDonBuc("P_BUC_01")).thenReturn(mockData)

        val response = apiController.getSeds("P_BUC_01", null)

        assertEquals(response.size , mockData.size)
        assertTrue(response.containsAll(mockData))
    }

    @Test
    fun `get all SED-types for specific Rinanr`() {
        val mockData = listOf(
                "P2000","P3000_NO",
                "P4000"
        )
        whenever(mockEuxService.getSedActionFromRina(ArgumentMatchers.anyString())).thenReturn(mockData)

        val response = apiController.getSeds("", "12123123123")

        assertEquals(mockData.size, response.size)
        assertTrue(response.containsAll(mockData))
    }



    @Test
    fun `get all institutions`() {
        val mockData = listOf("MAV02","DUMMY")
        whenever(mockEuxService.getCachedInstitusjoner()).thenReturn(mockData)

        val response = apiController.getInstitutions()
        assertNotNull(response)
        assertEquals(mockData.size, response.size )
        assertTrue(mockData == response)

    }

    @Test
    fun `check for aksjoner filter P`() {
        whenever(mockEuxService.getMuligeAksjoner(ArgumentMatchers.anyString())).thenReturn(getAksjonlist())

        val result = apiController.getMuligeAksjoner("123123123", "P")
        assertNotNull(result)

        println(result)

        assertEquals(1, result.size)
        assertEquals("P6000", result[0].dokumentType)

    }

    @Test
    fun `check for aksjoner filter X`() {
        whenever(mockEuxService.getMuligeAksjoner(ArgumentMatchers.anyString())).thenReturn(getAksjonlist())

        val result = apiController.getMuligeAksjoner("123123123", "X")
        assertNotNull(result)

        println(result)

        assertEquals(2, result.size)
        assertEquals("X6000", result[0].dokumentType)
        assertEquals("X200", result[1].dokumentType)

    }

    @Test
    fun `check for mulige aksjoner no filter`() {
        whenever(mockEuxService.getMuligeAksjoner(ArgumentMatchers.anyString())).thenReturn(getAksjonlist())
        val result = apiController.getMuligeAksjoner("123123123", "")
        assertNotNull(result)
        println(result)

        assertEquals(3, result.size)
        assertEquals("P6000", result[0].dokumentType)
        assertEquals("X6000", result[1].dokumentType)
        assertEquals("X200", result[2].dokumentType)
    }

    private fun getAksjonlist(): List<RINAaksjoner> {
        return listOf(
                RINAaksjoner(
                        navn = "Create",
                        id = "123123343123",
                        kategori = "Documents",
                        dokumentType = "P6000",
                        dokumentId = "213123123"
                ),
                RINAaksjoner(
                        navn = "Create",
                        id = "123123343123",
                        kategori = "Documents",
                        dokumentType = "X6000",
                        dokumentId = "213123123"
                ),
                RINAaksjoner(
                        navn = "Update",
                        id = "123123343123",
                        kategori = "Documents",
                        dokumentType = "X200",
                        dokumentId = "213123123"
                )
        )
    }


}