import {Button, Heading, Select} from "@navikt/ds-react";
import {AlignEndColumn, AlignStartRow, Column} from "@navikt/hoykontrast";
import {AddCircle} from "@navikt/ds-icons";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {Telefon as P2000Telefon} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";
import {RepeatableRow} from "../../../components/StyledComponents";
import Input from "../../../components/Forms/Input";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "../../../declarations/types";
import { PSED } from "declarations/app";

export interface TelefonProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const Telefon: React.FC<TelefonProps> = ({
  parentNamespace,
  PSED,
  updatePSED
}: TelefonProps): JSX.Element => {

  const dispatch = useDispatch()
  const error = null
  const namespace = `${parentNamespace}-person-kontakt-telefon`
  const target = 'nav.verge.person.kontakt.telefon'
  const telefonnumre: Array<P2000Telefon> | undefined = _.get(PSED, `${target}`)

  const [_newTelefon, _setNewTelefon] = useState<P2000Telefon | undefined>(undefined)
  const [_editTelefon, _setEditTelefon] = useState<P2000Telefon | undefined>(undefined)

  const [_editTelefonIndex, _setEditTelefonIndex] = useState<number | undefined>(undefined)
  const [_newTelefonForm, _setNewTelefonForm] = useState<boolean>(false)

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
      let newTelefonnumre: Array<P2000Telefon> | undefined = _.cloneDeep(telefonnumre)
      if (_.isNil(newTelefonnumre)) {
        newTelefonnumre = []
      }
      newTelefonnumre.push(_newTelefon)
      dispatch(updatePSED(`${target}`, newTelefonnumre))
      onCloseNewTelefon()
    }
  }

  const onCloseNewTelefon = () => {
    _setNewTelefon(undefined)
    _setNewTelefonForm(false)
    _setEditTelefonIndex(undefined)
  }

  const onCloseEditTelefon = () => {
    _setEditTelefon(undefined)
    _setEditTelefonIndex(undefined)
  }

  const onStartEditTelefon = (t: P2000Telefon, index: number) => {
    _setEditTelefon(t)
    _setEditTelefonIndex(index)
  }

  const onSaveEditTelefon = () => {
    dispatch(updatePSED(`${target}[${_editTelefonIndex}]`, _editTelefon))
    onCloseEditTelefon()
  }

  const onRemoveTelefon = (removedTelefon: P2000Telefon) => {
    const newTelefonnumre: Array<P2000Telefon> = _.reject(telefonnumre,
      (t: P2000Telefon) => _.isEqual(removedTelefon, t))
    dispatch(updatePSED(`${target}`, newTelefonnumre))
  }
  const renderTelefon = (telefon: P2000Telefon | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const inEditMode = index < 0 || _editTelefonIndex === index
    const _telefon = index < 0 ? _newTelefon : (inEditMode ? _editTelefon : telefon)
    return(
      <RepeatableRow>
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Input
                    error={error}
                    namespace={_namespace}
                    id=''
                    label="Nummer"
                    onChanged={(e) => setTelefonNummer(e, index)}
                    value={(_telefon?.nummer)  ?? ''}
                  />
                </Column>
                <Column>
                  <Select
                    label="Type"
                    onChange={(e) => setTelefonType(e.target.value, index)}
                    value={(_telefon?.type)  ?? ''}
                  >
                    <option value=''></option>
                    <option value='mobil'>Mobil</option>
                    <option value='hjem'>Hjem</option>
                    <option value='arbeid'>Arbeid</option>
                  </Select>
                </Column>
              </>
            )
            : (
              <Column>
                <div>{_telefon?.nummer} ({_telefon?.type})</div>
              </Column>
            )
          }

          <AlignEndColumn>
            <AddRemovePanel
              item={telefon}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveTelefon}
              onAddNew={onAddNewTelefon}
              onCancelNew={onCloseNewTelefon}
              onStartEdit={onStartEditTelefon}
              onConfirmEdit={onSaveEditTelefon}
              onCancelEdit={onCloseEditTelefon}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">Telefon</Heading>
      <AlignStartRow>
        <Column>
          {telefonnumre?.map(renderTelefon)}
        </Column>
      </AlignStartRow>
      {_newTelefonForm
        ? renderTelefon(null, -1)
        : (
            <Button
              variant='tertiary'
              onClick={() => _setNewTelefonForm(true)}
            >
              <AddCircle /> LEGG TIL TELEFON
            </Button>
          )
      }
    </>
  )
}

export default Telefon
