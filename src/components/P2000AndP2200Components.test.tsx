import {fireEvent, render, screen} from "@testing-library/react";
import {useDispatch} from "react-redux";
import {MainFormProps} from "src/applications/MainForm";
import {P2000SED} from "src/declarations/p2000";
import {P2200SED, Ytelse as P2200Ytelse} from "src/declarations/p2200";
import {Validation} from "src/declarations/app";
import {validateP2000} from "src/applications/P2000/validateP2000";
import performValidation from "src/utils/performValidation";
import ForsikretPerson from "./ForsikretPerson/ForsikretPerson";
import Yrkesaktivitet from "./Yrkesaktivitet/Yrkesaktivitet";
import Ytelser from "./Ytelser/Ytelser";
import Ektefelle from "./Ektefelle/Ektefelle";
import Barn from "./Barn/Barn";
import Verge from "./Verge/Verge";
import InformasjonOmBetaling from "./InformasjonOmBetaling/InformasjonOmBetaling";
import Diverse from "./Diverse/Diverse";
import {validateDiverse} from "./Diverse/validation";
import {validateYtelser} from "./Ytelser/validation";

const mockDispatch = jest.fn();
let mockValidation: Validation = {};

jest.mock("src/store", () => ({
  useAppSelector: () => ({
    validation: mockValidation,
    currentBuc: "test",
    bucs: {test: {cdm: "4.4"}}
  }),
  useAppDispatch: () => mockDispatch
}));

jest.mock("i18next", () => ({
  __esModule: true,
  default: {t: (key: string) => key}
}));

const createSed = (sed: string): P2000SED => ({
  sed,
  nav: {
    eessisak: [],
    bruker: {person: {}},
    verge: {person: {}},
    krav: {dato: "2026-10-22"},
    barn: [],
    ektefelle: {person: {}, type: ""}
  },
  pensjon: {}
});

const setPSED: MainFormProps["setPSED"] = (sed) => ({type: "set", payload: sed});
const updatePSED = jest.fn<ReturnType<MainFormProps["updatePSED"]>, Parameters<MainFormProps["updatePSED"]>>(
  (needle, value) => ({type: "update", payload: {needle, value}})
);

const renderSection = (Component: typeof Diverse | typeof Ytelser, sed: P2000SED | P2200SED) =>
  render(<Component PSED={sed} parentNamespace="custom" setPSED={setPSED} updatePSED={updatePSED}/>);

beforeEach(() => {
  jest.clearAllMocks();
  mockValidation = {};
  jest.mocked(useDispatch).mockReturnValue(mockDispatch);
});

const sections = [
  {Component: ForsikretPerson, p2000: "forsikretperson", p2200: "forsikretperson"},
  {Component: Yrkesaktivitet, p2000: "yrkesaktivitet", p2200: "yrkesaktivitet"},
  {Component: Ytelser, p2000: "ytelser", p2200: "ytelser"},
  {Component: Ektefelle, p2000: "ektefelle", p2200: "ektefelle"},
  {Component: Barn, p2000: "barn", p2200: "barn"},
  {Component: Verge, p2000: "verge", p2200: "verge"},
  {Component: InformasjonOmBetaling, p2000: "informasjonombetaling", p2200: "informasjonombetaling"},
  {Component: Diverse, p2000: "diverse-pensjon", p2200: "diverse-pensjon"}
];

describe.each(["P2000", "P2200"])("shared %s sections", (sedType) => {
  it.each(sections)("retains the $p2000/$p2200 namespace on unmount", ({Component, p2000, p2200}) => {
    const {unmount} = render(
      <Component
        PSED={createSed(sedType)}
        parentNamespace="custom"
        setPSED={setPSED}
        updatePSED={updatePSED}
      />
    );
    unmount();
    const namespace = `custom-${sedType === "P2000" ? p2000 : p2200}`;
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: "VALIDATION/SET",
      payload: expect.objectContaining({
        [namespace]: expect.objectContaining({feilmelding: expect.any(String)})
      })
    }));
  });

  it("keeps the claim date field ID and writes nav.krav.dato", () => {
    renderSection(Diverse, createSed(sedType));
    const field = screen.getByLabelText("p2000:form-diverse-pensjon-kravdato");
    expect(field).toHaveAttribute("id", "custom-diverse-pensjon-custom-diverse-pensjon-kravDato");
    fireEvent.change(field, {target: {value: "23.10.2026"}});
    fireEvent.blur(field);
    expect(updatePSED).toHaveBeenCalledWith("nav.krav.dato", "2026-10-23");
  });

  it("renders P2000-only Diverse fields only for P2000", () => {
    renderSection(Diverse, createSed(sedType));
    for (const label of [
      "p2000:form-diverse-pensjon-forespurtstartdato",
      "p2000:form-diverse-pensjon-angitidligstdato",
      "p2000:form-diverse-pensjon-mottaker",
      "p2000:form-diverse-pensjon-trekkgrunnlag",
      "p2000:form-diverse-utsettelse"
    ]) {
      if (sedType === "P2000") {
        expect(screen.getByText(label)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      }
    }
    expect(screen.getByText("p2000:form-diverse-pensjon-vedlegg")).toBeInTheDocument();
  });

  it("renders P2000-only benefit fields only for P2000", () => {
    renderSection(Ytelser, createSed(sedType));
    fireEvent.click(screen.getByRole("button", {name: "ui:add-new-x"}));
    for (const label of [
      "p2000:form-ytelse-mottas-basert-paa",
      "p2000:form-ytelse-bruttobeloep-bostedsbasert",
      "p2000:form-ytelse-bruttobeloep-arbeidsrelatert"
    ]) {
      if (sedType === "P2000") {
        expect(screen.getByText(label)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      }
    }
  });
});

it("retains the P2200 claim date error and unmount validation", () => {
  mockValidation = {
    "custom-diverse-pensjon-kravDato": {
      skjemaelementId: "custom-diverse-pensjon-kravDato",
      feilmelding: "missing-claim-date"
    }
  };
  const sed: P2200SED = {...createSed("P2200"), pensjon: {}};
  sed.nav.krav.dato = "";
  const {unmount} = renderSection(Diverse, sed);
  expect(screen.getByText("missing-claim-date")).toBeInTheDocument();
  unmount();
  expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
    type: "VALIDATION/SET",
    payload: expect.objectContaining({
      "custom-diverse-pensjon-kravDato": expect.objectContaining({
        feilmelding: "message:validation-chooseKravDato"
      })
    })
  }));
});

it("preserves P2200-specific benefit data when a common field is edited", () => {
  const ytelse: P2200Ytelse = {
    ytelse: "08",
    status: "02",
    institusjon: {institusjonsid: "NO:TEST"},
    mottasbasertpaaitem: [{
      mottasbasertpaa: "botid",
      totalbruttobeloepbostedsbasert: "1250",
      totalbruttobeloeparbeidsbasert: "750"
    }],
    beloep: [{beloep: "100", valuta: "NOK"}]
  };
  const sed: P2200SED = {...createSed("P2200"), pensjon: {ytelser: [ytelse]}};
  renderSection(Ytelser, sed);
  fireEvent.click(screen.getByRole("button", {name: "ui:edit"}));
  fireEvent.click(screen.getByRole("radio", {name: "p2000:form-ytelse-status-foreloebig"}));
  fireEvent.click(screen.getByRole("button", {name: "ui:save"}));
  expect(updatePSED).toHaveBeenCalledWith("pensjon.ytelser", [{...ytelse, status: "04"}]);
  expect(sed.pensjon.ytelser).toEqual([ytelse]);
});

it.each(["P2000", "P2200"])("clears additional attachment text when selecting another attachment for %s", (sedType) => {
  const sed = createSed(sedType);
  sed.pensjon.vedlegg = ["annet"];
  sed.pensjon.vedleggandre = "Existing attachment";
  renderSection(Diverse, sed);
  fireEvent.click(screen.getByRole("checkbox", {name: "Arbeidsattester"}));
  expect(updatePSED).toHaveBeenCalledWith("pensjon.vedlegg", ["annet", "arbeidsattester"]);
  expect(updatePSED).toHaveBeenCalledWith("pensjon.vedleggandre", null);
});

it("keeps P2000 benefit field IDs and gross amount validation", () => {
  const sed = createSed("P2000");
  sed.pensjon.ytelser = [{ytelse: "08", status: "02", totalbruttobeloepbostedsbasert: "invalid"}];
  renderSection(Ytelser, sed);
  fireEvent.click(screen.getByRole("button", {name: "ui:edit"}));
  expect(screen.getByLabelText("p2000:form-ytelse-bruttobeloep-bostedsbasert"))
    .toHaveAttribute("id", "custom-ytelser[0]-custom-ytelser[0]-totalbruttobeloepbostedsbasert");
  fireEvent.click(screen.getByRole("button", {name: "ui:save"}));
  expect(updatePSED).not.toHaveBeenCalled();
  expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
    type: "VALIDATION/SET",
    payload: expect.objectContaining({
      "custom-ytelser[0]-totalbruttobeloepbostedsbasert": expect.objectContaining({
        feilmelding: "validation:invalid-p2000-beloep"
      })
    })
  }));
});

it.each(["P2000", "P2200"])("validates only the applicable %s gross amount fields", (sed) => {
  const validation: Validation = {};
  expect(validateYtelser(validation, "benefits", {
    sed,
    ytelser: [{ytelse: "08", status: "02", totalbruttobeloepbostedsbasert: "invalid"}]
  })).toBe(sed === "P2000");
  expect(validation["benefits[0]-totalbruttobeloepbostedsbasert"]?.feilmelding)
    .toBe(sed === "P2000" ? "validation:invalid-p2000-beloep" : undefined);
});

it("preserves shared Diverse rules and the existing requested-start error ID", () => {
  const validation: Validation = {};
  expect(validateDiverse(validation, "p2200-diverse-pensjon", {
    sed: "P2200",
    pensjon: {vedlegg: ["annet"], forespurtstartdato: "invalid"},
    krav: {dato: ""}
  })).toBe(true);
  expect(validation["p2200-diverse-pensjon-vedleggandre"]).toBeDefined();
  expect(validation["p2200-diverse-pensjon-forespurtstartdato  "]).toBeDefined();
  expect(validation["p2200-diverse-pensjon-kravDato"]).toBeDefined();
});

it("retains all P2000 aggregate section namespaces without requiring claim date", () => {
  const sed = createSed("P2000");
  sed.nav.krav.dato = "";
  const validation: Validation = {};
  expect(performValidation(validation, "p2000", validateP2000, {P2000SED: sed})).toBe(false);
  for (const {p2000} of sections) {
    expect(validation[`p2000-${p2000}`]?.feilmelding).toBe("ok");
  }
  expect(validation["p2000-diverse-pensjon-kravDato"]).toBeUndefined();
});
