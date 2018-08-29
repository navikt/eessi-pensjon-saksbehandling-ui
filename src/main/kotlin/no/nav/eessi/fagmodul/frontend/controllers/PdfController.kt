package no.nav.eessi.fagmodul.frontend.controllers

import no.nav.eessi.fagmodul.frontend.models.PDFRequest
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.util.Base64Utils
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

        val tmpDir = File(System.getProperty("java.io.tmpdir"));
        val timeStamp = System.nanoTime();
        val workingDir = File(tmpDir, "pdf-" + timeStamp);
        workingDir.mkdir();
        val outputDir = File(tmpDir, "pdfoutput-" + timeStamp);
        outputDir.mkdir();

        logger.debug("Request : $request")

        val workingPdfs = HashMap<String, PDDocument>()
        val response = HashMap<String, Map<String, Any>>()

        request.pdfs.forEach { pdf ->
            val file = File(workingDir, pdf.name)
            val fos = FileOutputStream(file)
            fos.write(Base64Utils.decodeFromString(pdf.base64))
            fos.close()
            workingPdfs.put(pdf.name, PDDocument.load(file))
        }

        request.recipe.forEach { (targetPdf, recipe) ->

            if (!recipe.isEmpty()) {

                var outputPdf = PDDocument()

                recipe.forEach { step ->
                    val sourcePdf = workingPdfs.get(step.name)
                    val page = sourcePdf?.getPage(step.pageNumber - 1) // here, page #1 is accessed as index 0
                    outputPdf.addPage(page)
                }

                val outputPdfFile = File(outputDir, targetPdf)
                outputPdf.save(outputPdfFile)
                outputPdf.close()

                response.put(targetPdf, mapOf(
                        "base64" to Base64.getEncoder().encodeToString(outputPdfFile.readBytes()),
                        "name" to targetPdf + ".pdf",
                        "size" to outputPdfFile.length(),
                        "numPages" to recipe.size
                ))
            }
        }

        // cleanup
        workingDir.deleteRecursively();
        outputDir.deleteRecursively();

        return ResponseEntity.ok(response);

    }
}


