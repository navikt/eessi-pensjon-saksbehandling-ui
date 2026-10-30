import _ from "lodash";
import { Validation } from "src/declarations/app";
import { P2200SED } from "src/declarations/p2200";
import mockP2200 from "src/mocks/buc/sed_P2200";
import performValidation from "src/utils/performValidation";
import { validateP2200 } from "./validateP2200";

jest.mock("i18next", () => ({
  __esModule: true,
  default: { t: (key: string) => key }
}));

describe("validateP2200", () => {
  it.each([
    ["", true, "message:validation-chooseKravDato"],
    ["not-a-date", true, "validation:invalidDateFormat"],
    ["2026-10-22", false, undefined]
  ])("validates claim date %s", (date, expectedHasErrors, expectedMessage) => {
    const sed = _.cloneDeep(mockP2200);
    sed.nav.krav.dato = date;
    const validation: Validation = {};

    const hasErrors = performValidation(validation, "p2200", validateP2200, {
      P2200SED: sed
    });

    expect(hasErrors).toBe(expectedHasErrors);
    expect(validation["p2200-diverse-pensjon-kravDato"]?.feilmelding).toBe(expectedMessage);
  });

  it("clears previous claim date errors when the date is corrected", () => {
    const sed = _.cloneDeep(mockP2200);
    const validation: Validation = {};
    performValidation(validation, "p2200", validateP2200, { P2200SED: sed });
    expect(validation["p2200-diverse-pensjon-kravDato"]).toBeDefined();

    sed.nav.krav.dato = "2026-10-22";
    const hasErrors = performValidation(validation, "p2200", validateP2200, {
      P2200SED: sed
    });

    expect(hasErrors).toBe(false);
    expect(validation["p2200-diverse-pensjon-kravDato"]).toBeUndefined();
  });

  const invalidSections: Array<{
    section: string
    update: (sed: P2200SED) => void
    errorId: string
  }> = [
    {
      section: "forsikretperson",
      update: (sed) => {
        sed.nav.bruker = { person: { foedested: { by: "Oslo" } } };
      },
      errorId: "foedested-land"
    },
    {
      section: "yrkesaktivitet",
      update: (sed) => {
        sed.pensjon.bruker = { person: {}, arbeidsforhold: [{}] };
      },
      errorId: "[0]-yrkesaktivitet"
    },
    {
      section: "ytelser",
      update: (sed) => {
        sed.pensjon.ytelser = [{}];
      },
      errorId: "[0]-ytelse"
    },
    {
      section: "ektefelle",
      update: (sed) => {
        sed.nav.ektefelle = { type: "ektefelle", person: {} };
      },
      errorId: "person-fornavn"
    },
    {
      section: "barn",
      update: (sed) => {
        sed.nav.barn = [{ person: {} }];
      },
      errorId: "[0]-person-fornavn"
    },
    {
      section: "verge",
      update: (sed) => {
        sed.nav.verge = { person: { fornavn: "Test" } };
      },
      errorId: "person-etternavn"
    },
    {
      section: "informasjonombetaling",
      update: (sed) => {
        sed.nav.bruker = {
          person: {},
          bank: {
            konto: { kontonr: "", innehaver: {}, sepa: { iban: "", swift: "" } },
            adresse: { gate: "", by: "", land: "" }
          }
        };
      },
      errorId: "konto-sepa-iban"
    },
    {
      section: "diverse-pensjon",
      update: (sed) => {
        sed.pensjon.vedlegg = ["annet"];
        sed.pensjon.vedleggandre = undefined;
      },
      errorId: "vedleggandre"
    }
  ];

  it.each(invalidSections)("reuses validation for $section", ({ section, update, errorId }) => {
    const sed = _.cloneDeep(mockP2200);
    sed.nav.krav.dato = "2026-10-22";
    update(sed);
    const validation: Validation = {};

    const hasErrors = performValidation(validation, "p2200", validateP2200, { P2200SED: sed });
    const prefix = `p2200-${section}`;
    const fieldId = prefix + (errorId.startsWith("[") ? "" : "-") + errorId;

    expect(hasErrors).toBe(true);
    expect(validation[prefix]?.feilmelding).toBe("error");
    expect(validation[fieldId]?.feilmelding).toBeDefined();
    expect(Object.keys(validation).some(key => key.startsWith("p2000"))).toBe(false);
  });

  it("collects errors from multiple sections without stopping at the first error", () => {
    const sed = _.cloneDeep(mockP2200);
    sed.pensjon.ytelser = [{}];
    sed.pensjon.bruker = { person: {}, arbeidsforhold: [{}] };
    const validation: Validation = {};

    expect(performValidation(validation, "p2200", validateP2200, { P2200SED: sed })).toBe(true);
    expect(validation["p2200-yrkesaktivitet"]?.feilmelding).toBe("error");
    expect(validation["p2200-ytelser"]?.feilmelding).toBe("error");
    expect(validation["p2200-diverse-pensjon"]?.feilmelding).toBe("error");
  });
});
