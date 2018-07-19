package no.nav.eessi.fagmodul.frontend.models

import com.fasterxml.jackson.annotation.JsonProperty

//{"institution":[{"NO:"DUMMY"}],"buc":"P_BUC_06","sed":"P6000","caseId":"caseId","subjectArea":"pensjon"}
data class FrontendRequest(
        val subjectArea: String? = null,
        val caseId: String? = null,
        val buc: String? = null,
        val sed : String? = null,
        val institutions: List<Institusjon>? = null,
        @JsonProperty("actorId")
        var pinid: String? = null
)

data class Institusjon(
        val country: String? = null,
        val institution: String? =null
)

data class PDFRequest(
        val recipe: List<RecipeStep>,
        val pdfs: List<PDF>
)

data class RecipeStep(
        val fileName: String,
        val pageNumber: Int,
        val fileOrder: Int
)

data class PDF(
        val base64: String,
        val file: String,
        val numPages: Int
)