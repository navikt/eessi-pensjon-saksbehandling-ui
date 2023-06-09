import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Telefon, Verge as P2000Verge} from "../../declarations/p2000";
import Input from "../../components/Forms/Input";
import _ from "lodash";
import {AlignStartRow, Column, VerticalSeparatorDiv, PaddedDiv, AlignEndColumn} from '@navikt/hoykontrast'
import {Button, Heading} from "@navikt/ds-react";
import {MainFormProps} from "./MainForm";
import CountrySelect from "@navikt/landvelger";
import AddRemovePanel from "components/AddRemovePanel/AddRemovePanel";
import {getIdx} from "../../utils/namespace";
import {AddCircle} from "@navikt/ds-icons";

const Verge: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-verge`
  const target = 'nav.verge'
  const verge: P2000Verge | undefined = _.get(PSED, target)
  const telefonnumre: Array<Telefon> | undefined = _.get(PSED, `${target}.person.kontakt.telefon`)

  const [_newTelefon, _setNewTelefon] = useState<Telefon | undefined>(undefined)
  const [_editTelefon, _setEditTelefon] = useState<Telefon | undefined>(undefined)

  const [_editTelefonIndex, _setEditTelefonIndex] = useState<number | undefined>(undefined)
  const [_newTelefonForm, _setNewTelefonForm] = useState<boolean>(false)

  const error = null

  const setEtternavn = (etternavn: string) => {
    dispatch(updatePSED(`${target}.person.etternavn`, etternavn))
  }

  const setFornavn = (fornavn: string) => {
    dispatch(updatePSED(`${target}.person.fornavn`, fornavn))
  }

  const setVergemaalMandat = (mandat: string) => {
    dispatch(updatePSED(`${target}.vergemaal.mandat`, mandat))
  }

  const setGate = (gate: string) => {
    dispatch(updatePSED(`${target}.adresse.gate`, gate))
  }

  const setPostnummer = (postnummer: string) => {
    dispatch(updatePSED(`${target}.adresse.postnummer`, postnummer))
  }

  const setBy = (by: string) => {
    dispatch(updatePSED(`${target}.adresse.by`, by))
  }

  const setRegion = (region: string) => {
    dispatch(updatePSED(`${target}.adresse.region`, region))
  }


  const setTelefonNummer = (nummer: string, index: number) => {
    if (index < 0) {
      _setNewTelefon({
        ..._newTelefon,
        nummer: nummer.trim(),
        type: _newTelefon?.type!
      })
      return
    }
    _setEditTelefon({
      ..._editTelefon,
      nummer: nummer.trim(),
      type: _editTelefon?.type!
    })
  }

  const setTelefonType = (type: string, index: number) => {
    if (index < 0) {
      _setNewTelefon({
        ..._newTelefon,
        type: type.trim(),
        nummer: _newTelefon?.nummer!
      })
      return
    }
    _setEditTelefon({
      ..._editTelefon,
      type: type.trim(),
      nummer: _editTelefon?.nummer!
    })
  }

  const onAddNewTelefon = () => {
    if (!!_newTelefon) {
      let newTelefonnumre: Array<Telefon> | undefined = _.cloneDeep(telefonnumre)
      if (_.isNil(newTelefonnumre)) {
        newTelefonnumre = []
      }
      newTelefonnumre.push(_newTelefon)
      dispatch(updatePSED(`${target}.person.kontakt.telefon`, newTelefonnumre))
      onCloseNewTelefon()
    }
  }

  const onCloseNewTelefon = () => {
    _setNewTelefon(undefined)
    _setNewTelefonForm(false)
  }

  const renderTelefon = (telefon: Telefon | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const inEditMode = index < 0 || _editTelefonIndex === index
    const _telefon = index < 0 ? _newTelefon : (inEditMode ? _editTelefon : telefon)
    return(
      <AlignStartRow>
          {inEditMode
            ? (
                <>
                  <Column>
                    <Input
                      error={error}
                      namespace={_namespace}
                      id=''
                      label="Telefon"
                      onChanged={(e) => setTelefonNummer(e, index)}
                      value={(_telefon?.nummer)  ?? ''}
                    />
                  </Column>
                  <Column>
                    <Input
                      error={error}
                      namespace={_namespace}
                      id=''
                      label="Type"
                      onChanged={(e) => setTelefonType(e, index)}
                      value={(_telefon?.type)  ?? ''}
                    />
                  </Column>
                </>
              )
            : (
                <Column>
                  <div>TELEFON: {_telefon?.nummer}</div>
                </Column>
              )
          }

        <AlignEndColumn>
          <AddRemovePanel
            item={telefon}
            marginTop={index < 0}
            index={index}
            inEditMode={inEditMode}
            onRemove={()=>{}}
            onAddNew={onAddNewTelefon}
            onCancelNew={onCloseNewTelefon}
            onStartEdit={()=>{}}
            onConfirmEdit={()=>{}}
            onCancelEdit={() => {}}
          />
        </AlignEndColumn>
      </AlignStartRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        <Heading size='small'>
          Informasjon om representant/verge
        </Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Etternavn"
              onChanged={setEtternavn}
              value={(verge?.person?.etternavn) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Fornavn"
              onChanged={setFornavn}
              value={(verge?.person?.fornavn)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Årsak til vergemål, representasjon"
              onChanged={setVergemaalMandat}
              value={(verge?.vergemaal?.mandat)  ?? ''}
            />
          </Column>
          <Column></Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Heading size="small">Adresse</Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Gate"
              onChanged={setGate}
              value={(verge?.adresse?.gate)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Postnummer"
              onChanged={setPostnummer}
              value={(verge?.adresse?.postnummer) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="By"
              onChanged={setBy}
              value={(verge?.adresse?.by)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Region"
              onChanged={setRegion}
              value={(verge?.adresse?.region)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <CountrySelect
              label='Land'
              ariaLabel='Land'
              flags={false}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            {telefonnumre?.map(renderTelefon)}
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        {_newTelefonForm
          ? renderTelefon(null, -1)
          : (
              <PaddedDiv>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewTelefonForm(true)}
                >
                  <AddCircle /> LEGG TIL TELEFON
                </Button>
              </PaddedDiv>
            )
        }
      </PaddedDiv>
    </>
  )
}

export default Verge
