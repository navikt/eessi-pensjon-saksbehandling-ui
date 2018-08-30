package no.nav.eessi.fagmodul.frontend.controllers

import no.nav.eessi.fagmodul.frontend.models.PDFRequest
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.util.Base64Utils
import java.io.ByteArrayOutputStream
import java.io.File
import java.util.*
import java.io.FileOutputStream
import java.nio.file.Files
import java.nio.file.Path


private val logger = LoggerFactory.getLogger(PdfController::class.java)

@RestController
@RequestMapping("/pdf")
class PdfController {

    @PostMapping("/generate")
    fun generatePDF(@RequestBody request: PDFRequest): ResponseEntity<Map<String, Map<String, Any>>> {
        logger.debug("Request : $request")

        val workingPdfs = HashMap<String, PDDocument>()
        val response = HashMap<String, Map<String, Any>>()

        request.pdfs.forEach { pdf ->
            workingPdfs[pdf.name] = PDDocument.load(Base64Utils.decodeFromString(pdf.base64))
        }

        request.recipe.forEach { (targetPdf, recipe) ->

            if (!recipe.isEmpty()) {

                var outputPdf = PDDocument()
                val baos = ByteArrayOutputStream()

                recipe.forEach { step ->
                    val sourcePdf = workingPdfs.get(step.name)
                    val page = sourcePdf?.getPage(step.pageNumber - 1) // page #1 is accessed as index 0
                    outputPdf.addPage(page)
                }

                outputPdf.save(baos)
                outputPdf.close()

                response.put(targetPdf, mapOf(
                    "base64" to Base64.getEncoder().encodeToString(baos.toByteArray()),
                    "name" to targetPdf + ".pdf",
                    "size" to baos.toByteArray().size,
                    "numPages" to recipe.size
                ))
            }
        }
        return ResponseEntity.ok(response)
    }
}


