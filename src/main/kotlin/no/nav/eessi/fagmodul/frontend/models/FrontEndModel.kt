package no.nav.eessi.fagmodul.frontend.models

import com.fasterxml.jackson.annotation.JsonProperty

//{"institution":[{"NO:"DUMMY"}],"buc":"P_BUC_06","sed":"P6000","caseId":"caseId","subjectArea":"pensjon"}
//data class FrontendRequest(
//        val subjectArea: String? = null,
//        val caseId: String? = null,
//        val buc: String? = null,
//        val sed : String? = null,
//        val institutions: List<Institusjon>? = null,
//        @JsonProperty("actorId")
//        var pinid: String? = null
//)

data class FrontendRequest(
        //sector
        val subjectArea: String? = null,
        //PEN-saksnummer
        val caseId: String? = null,
        val buc: String? = null,
        val sed : String? = null,
        //mottakere
        val institutions: List<InstitusjonItem>? = null,
        @JsonProperty("actorId")
        //aktoerid
        val pinid: String? = null,
        @JsonProperty("dodactorId")
        val dodpinid: String? = null,
        //mere maa legges til..
        val euxCaseId: String? = null,
        //partpayload json/sed
        val payload: String? = null,
        val sendsed: Boolean? = null
)


data class InstitusjonItem(
        val country: String? = null,
        val institution: String? = null
)

data class PDFRequest(
        val recipe: Map<String, List<RecipeStep>>,
        val pdfs: List<PDF>
)

data class RecipeStep(
        val name: String,
        val pageNumber: Int
)

data class PDF(
        val base64: String,
        val name: String,
        val numPages: Int,
        val size: Int
)