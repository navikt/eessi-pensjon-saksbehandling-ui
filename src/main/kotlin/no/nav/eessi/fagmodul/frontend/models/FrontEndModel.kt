package no.nav.eessi.fagmodul.frontend.models

//{"institution":[{"NO:"DUMMY"}],"buc":"P_BUC_06","sed":"P6000","caseId":"caseId","subjectArea":"pensjon"}
data class FrontendRequest(
        val subjectArea: String? = null,
        val caseId: String? = null,
        val buc: String? = null,
        val sed : String? = null,
        val institutions: List<Institusjon>? = null
)

data class Institusjon(
        val country: String? = null,
        val institution: String? =null
)
