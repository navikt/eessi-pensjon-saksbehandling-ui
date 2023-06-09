import {Button, Heading} from "@navikt/ds-react";
import {AlignEndColumn, AlignStartRow, Column} from "@navikt/hoykontrast";
import {AddCircle} from "@navikt/ds-icons";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {Email} from "../../declarations/p2000";
import {getIdx} from "../../utils/namespace";
import {RepeatableRow} from "../../components/StyledComponents";
import Input from "../../components/Forms/Input";
import AddRemovePanel from "../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "../../declarations/types";
import { PSED } from "declarations/app.d";

export interface EpostProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const Epost: React.FC<EpostProps> = ({
  parentNamespace,
  PSED,
  updatePSED
}: EpostProps): JSX.Element => {

  const dispatch = useDispatch()
  const error = null
  const namespace = `${parentNamespace}-person-kontakt-email`
  const target = 'nav.verge.person.kontakt.email'
  const epostAdresser: Array<Email> | undefined = _.get(PSED, `${target}`)

  const [_newEpost, _setNewEpost] = useState<Email | undefined>(undefined)
  const [_editEpost, _setEditEpost] = useState<Email | undefined>(undefined)

  const [_editEpostIndex, _setEditEpostIndex] = useState<number | undefined>(undefined)
  const [_newEpostForm, _setNewEpostForm] = useState<boolean>(false)

  const setEpost = (adresse: string, index: number) => {
    if (index < 0) {
      _setNewEpost({
        ..._newEpost,
        adresse: adresse.trim(),
      })
      return
    }
    _setEditEpost({
      ..._editEpost,
      adresse: adresse.trim(),
    })
  }

  const onAddNewEpost = () => {
    if (!!_newEpost) {
      let newEpostadresser: Array<Email> | undefined = _.cloneDeep(epostAdresser)
      if (_.isNil(newEpostadresser)) {
        newEpostadresser = []
      }
      newEpostadresser.push(_newEpost)
      dispatch(updatePSED(`${target}`, newEpostadresser))
      onCloseNewEpost()
    }
  }

  const onCloseNewEpost = () => {
    _setNewEpost(undefined)
    _setNewEpostForm(false)
    _setEditEpostIndex(undefined)
  }

  const onCloseEditEpost = () => {
    _setEditEpost(undefined)
    _setEditEpostIndex(undefined)
  }

  const onStartEditEpost = (t: Email, index: number) => {
    _setEditEpost(t)
    _setEditEpostIndex(index)
  }

  const onSaveEditEpost = () => {
    dispatch(updatePSED(`${target}[${_editEpostIndex}]`, _editEpost))
    onCloseEditEpost()
  }

  const onRemoveEpost = (removedEpost: Email) => {
    const newEpostadresser: Array<Email> = _.reject(epostAdresser,
      (t: Email) => _.isEqual(removedEpost, t))
    dispatch(updatePSED(`${target}`, newEpostadresser))
  }
  const renderEpost = (epost: Email | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const inEditMode = index < 0 || _editEpostIndex === index
    const _epost = index < 0 ? _newEpost : (inEditMode ? _editEpost : epost)
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
                    label="Adresse"
                    onChanged={(e) => setEpost(e, index)}
                    value={(_epost?.adresse)  ?? ''}
                  />
                </Column>
              </>
            )
            : (
              <Column>
                <div>{_epost?.adresse}</div>
              </Column>
            )
          }

          <AlignEndColumn>
            <AddRemovePanel
              item={epost}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveEpost}
              onAddNew={onAddNewEpost}
              onCancelNew={onCloseNewEpost}
              onStartEdit={onStartEditEpost}
              onConfirmEdit={onSaveEditEpost}
              onCancelEdit={onCloseEditEpost}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">Epost</Heading>
      <AlignStartRow>
        <Column>
          {epostAdresser?.map(renderEpost)}
        </Column>
      </AlignStartRow>
      {_newEpostForm
        ? renderEpost(null, -1)
        : (
            <Button
              variant='tertiary'
              onClick={() => _setNewEpostForm(true)}
            >
              <AddCircle /> LEGG TIL EPOST
            </Button>
          )
      }
    </>
  )
}

export default Epost
