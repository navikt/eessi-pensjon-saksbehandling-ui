import React, {Fragment, JSX, useEffect, useState} from "react";
import {State} from "src/declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store";
import {
  BodyLong,
  Box,
  Button,
  Heading,
  HGrid, HStack,
  Label,
  Radio, RadioGroup,
  Select,
  Spacer,
  Table,
  Tag,
  VStack
} from "@navikt/ds-react";
import _ from "lodash";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {Beloep, Ytelse} from "src/declarations/p2000";
import {getIdx} from "src/utils/namespace";
import {Validation} from "src/declarations/app";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "src/utils/validation";
import useValidation from "../../../hooks/useValidation";
import {validateYtelse, validateYtelser, ValidationYtelseProps, ValidationYtelserProps} from "./validation";
import {resetValidation, setValidation} from "src/actions/validation";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import BeloepRows from "../Beloep/BeloepRows";
import {formatDate, removeWhiteSpaceAndReplaceCommas, replacePeriodsWithCommas} from "src/utils/utils";
import Input from "../../../components/Forms/Input";
import DateField from "../DateField/DateField";
import ErrorLabel from "src/components/Forms/ErrorLabel";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import styles from "src/assets/css/common.module.css";


const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Ytelser: React.FC<MainFormProps> = ({
 label,
 parentNamespace,
 PSED,
 updatePSED
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {validation} = useAppSelector(mapState)
  const namespace = `${parentNamespace}-ytelser`
  const target = 'pensjon.ytelser'
  const ytelser:  Array<Ytelse> | undefined = _.get(PSED, target)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationYtelseProps>(validateYtelse, namespace)

  const [_newYtelse, _setNewYtelse] = useState<Ytelse | undefined>(undefined)
  const [_editYtelse, _setEditYtelse] = useState<Ytelse | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)

  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_newBeloepForm, _setNewBeloepForm] = useState<boolean>(false)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationYtelserProps>(
      clonedvalidation, namespace, validateYtelser, {
        ytelser: ytelser
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    if(_newForm || _editYtelse){
      dispatch(addEditingItem("ytelse"))
    } else if (!_newForm && !_editYtelse){
      dispatch(deleteEditingItem("ytelse"))
    }
  }, [_newForm, _editYtelse])

  const setYtelser = (newYtelser: Array<Ytelse>) => {
    let ytelser: Array<Ytelse> | undefined = _.cloneDeep(newYtelser)
    if (_.isNil(ytelser)) {
      ytelser = []
    }
    dispatch(updatePSED(`${target}`, ytelser))
    dispatch(resetValidation(namespace))
  }

  const setYtelseProperty = (property: string, value: string, index: number) => {
    if (index < 0) {
      _setNewYtelse((prevState) => {
        return {
          ...prevState,
          [property]: value
        }
      })
      return
    }
    _setEditYtelse((prevState) => {
      return {
        ...prevState,
        [property]: value
      }
    })
  }

  const setBeloep = (beloep: Array<Beloep>, index: number) => {
    if (index < 0) {
      _setNewYtelse({
        ..._newYtelse,
        beloep: beloep
      })
      return
    }
    _setEditYtelse({
      ..._editYtelse,
      beloep: beloep
    })
  }

  const onCloseNew = () => {
    _setNewYtelse(undefined)
    _setNewForm(false)
    _setNewBeloepForm(false)
    _resetValidation()
  }

  const onCloseEdit = (namespace: string) => {
    _setEditYtelse(undefined)
    _setEditIndex(undefined)
    _setNewBeloepForm(false)
    dispatch(resetValidation(namespace))
  }

  const onRemove = (removedYtelse: Ytelse) => {
    const newYtelser: Array<Ytelse> = _.reject(ytelser,
      (y: Ytelse) => _.isEqual(removedYtelse, y))
    dispatch(updatePSED(`${target}`, newYtelser))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      ytelse: _newYtelse,
    })
    if (!!_newYtelse && valid) {
      let newYtelser: Array<Ytelse> = _.cloneDeep(ytelser) as Array<Ytelse>
      if (_.isNil(newYtelser)) {
        newYtelser = []
      }
      newYtelser.push(_newYtelse)
      setYtelser(newYtelser)
      onCloseNew()
    }
  }

  const onStartEdit = (ytelse: Ytelse, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditYtelse(ytelse)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationYtelseProps>(
      clonedValidation, namespace, validateYtelse, {
        ytelse: _editYtelse,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editYtelse && !hasErrors) {
      const newYtelser: Array<Ytelse> = _.cloneDeep(ytelser) as Array<Ytelse>
      newYtelser[_editIndex] = _editYtelse
      setYtelser(newYtelser)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
    _setNewBeloepForm(false)
  }

  const ytelseOptions = [
    {value:'01', label:t('p2000:form-ytelse-ytelse-fortsatt-loennsutbetaling-ved-sykdom')},
    {value:'02', label:t('p2000:form-ytelse-ytelse-sykepenger-ved-arbeidsufoerhet')},
    {value:'03', label:t('p2000:form-ytelse-ytelse-kortsiktig-kontantytelse-ved-arbeidsulykke-eller-yrkessykdom')},
    {value:'04', label:t('p2000:form-ytelse-ytelse-rehabiliteringspenger')},
    {value:'05', label:t('p2000:form-ytelse-ytelse-familieytelse')},
    {value:'06', label:t('p2000:form-ytelse-ytelse-dagpenger')},
    {value:'07', label:t('p2000:form-ytelse-ytelse-foertidspensjon')},
    {value:'08', label:t('p2000:form-ytelse-ytelse-ufoerepensjon')},
    {value:'09', label:t('p2000:form-ytelse-ytelse-tidligpensjonering-alderspensjon')},
    {value:'10', label:t('p2000:form-ytelse-ytelse-alderspensjon')},
    {value:'11', label:t('p2000:form-ytelse-ytelse-etterlattepensjon')},
    {value:'12', label:t('p2000:form-ytelse-ytelse-pensjon-pga-arbeidsulykke-eller-yrkessykdom')},
    {value:'13', label:t('p2000:form-ytelse-ytelse-pensjonslignende-ytelse-som-utbetales-under-obligatorisk-trafikkforsikring-ansvarsforsikring')},
    {value:'99', label:t('p2000:form-ytelse-ytelse-annen-andre-ytelser')},
  ]

  const statusOptions = [
    {value:'01', label:t('p2000:form-ytelse-status-soekt')},
    {value:'02', label:t('p2000:form-ytelse-status-innvilget')},
    {value:'03', label:t('p2000:form-ytelse-status-avslaatt')},
    {value:'04', label:t('p2000:form-ytelse-status-foreloebig')}
  ]

  const getYtelseLabel = (ytelse:string | undefined | null) => {
    const selectedYtelse = ytelseOptions.find((y) => y.value === ytelse)
    return selectedYtelse ? selectedYtelse.label : ytelse
  }

  const getStatusLabel = (status: string | undefined | null) => {
    const selectedStatus = statusOptions.find((s) => s.value === status)
    return selectedStatus ? selectedStatus.label : status
  }

  const renderRow = (ytelse: Ytelse | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _ytelse = index < 0 ? _newYtelse : (inEditMode ? _editYtelse : ytelse)

    const addremovepanel = (
      <AddRemovePanel<Ytelse>
        item={ytelse}
        alwaysVisible={true}
        marginTop={inEditMode}
        index={index}
        inEditMode={inEditMode}
        onRemove={onRemove}
        onAddNew={onAddNew}
        onCancelNew={onCloseNew}
        onStartEdit={onStartEdit}
        onConfirmEdit={onSaveEdit}
        onCancelEdit={() => onCloseEdit(_namespace)}
      />
    )

    if(inEditMode){
      return (
        <Fragment key={_namespace}>
          <Box
            id={'repeatablerow-' + _namespace}
            key={index}
            className={classNames(styles.repeatableBox, {
              [styles.new]: index < 0,
              [styles.error]: hasNamespaceWithErrors(_v, _namespace),
              [styles.withBorder]: true
            })}
            padding="4"
          >
            <VStack gap="4">
              <HGrid gap="4" columns={2}>
                <Select
                  error={_v[_namespace + '-ytelse']?.feilmelding}
                  id={_namespace + '-ytelse'}
                  label={t('p2000:form-ytelse')}
                  onChange={(e) => setYtelseProperty("ytelse", e.target.value, index)}
                  value={(_ytelse?.ytelse)  ?? ''}
                >
                  <option value=''>Velg</option>
                  {ytelseOptions.map((option) => {
                    return(<option key={option.value} value={option.value}>{option.label}</option>)
                  })}
                </Select>
                {_ytelse?.ytelse === "99" &&
                  <Input
                    error={_v[_namespace + '-annenytelse']?.feilmelding}
                    namespace={_namespace}
                    id={_namespace + '-annenytelse'}
                    label={t('p2000:form-ytelse-annen-ytelse')}
                    onChanged={(e) => setYtelseProperty("annenytelse", e, index)}
                    value={ytelse?.annenytelse ?? ''}
                  />
                }


              </HGrid>
              <RadioGroup className={"horizontalRadioGroup"}
                error={_v[_namespace + '-status']?.feilmelding}
                id={_namespace + "-status"}
                legend={t('p2000:form-ytelse-status')}
                onChange={(e: any) => setYtelseProperty("status", e, index)}
                value={_ytelse?.status}
              >
                {statusOptions.map((option) => {
                  return(<Radio key={option.value} value={option.value}>{option.label}</Radio>)
                })}
              </RadioGroup>
              <HGrid gap="4" columns={2}>
                <DateField
                  id={_namespace + '-startdatoutbetaling'}
                  label={t('p2000:form-ytelse-startdato-utbetaling')}
                  index={index}
                  error={_v[_namespace + '-startdatoutbetaling']?.feilmelding}
                  namespace={_namespace}
                  onChanged={(e) => setYtelseProperty("startdatoutbetaling", e!, index)}
                  dateValue={_ytelse?.startdatoutbetaling}
                />
                <DateField
                  id={_namespace + '-sluttdatoutbetaling'}
                  label={t('p2000:form-ytelse-sluttdato-utbetaling')}
                  index={index}
                  error={_v[_namespace + '-sluttdatoutbetaling']?.feilmelding}
                  namespace={_namespace}
                  onChanged={(e) => setYtelseProperty("sluttdatoutbetaling", e!, index)}
                  dateValue={_ytelse?.sluttdatoutbetaling}
                />
              </HGrid>
              <HGrid gap="4" columns={2}>
                <DateField
                  id={_namespace + '-startdatoretttilytelse'}
                  label={t('p2000:form-ytelse-startdato-rett-til-ytelser')}
                  index={index}
                  error={_v[_namespace + '-startdatoretttilytelse']?.feilmelding}
                  namespace={_namespace}
                  onChanged={(e) => setYtelseProperty("startdatoretttilytelse", e!, index)}
                  dateValue={_ytelse?.startdatoretttilytelse}
                />
                <Spacer/>
              </HGrid>
              <Table zebraStripes={true}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Valuta</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beløp siden</Table.HeaderCell>
                    <Table.HeaderCell scope="col" colSpan={2}>Betalingshyppighet</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <BeloepRows beloep={_ytelse?.beloep} setBeloep={setBeloep} parentIndex={index} parentEditMode={true} newBeloepForm={_newBeloepForm} setNewBeloepForm={_setNewBeloepForm} parentNamespace={_namespace}/>
                </Table.Body>
              </Table>
              {inEditMode && !_newBeloepForm &&
                <Box>
                  <Button
                    variant='tertiary'
                    onClick={() => _setNewBeloepForm(true)}
                    iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
                  >
                    {t('ui:add-new-x', { x: t('p2000:form-ytelse-beloep')?.toLowerCase() })}
                  </Button>
                </Box>
              }
              <RadioGroup className={"horizontalRadioGroup"}
                error={_v[_namespace + '-mottasbasertpaa']?.feilmelding}
                id={_namespace + "-mottasbasertpaa"}
                legend={t('p2000:form-ytelse-mottas-basert-paa')}
                onChange={(e: any) => setYtelseProperty("mottasbasertpaa", e, index)}
                value={_ytelse?.mottasbasertpaa}
              >
                <Radio value="botid">{t('p2000:form-ytelse-mottas-basert-paa-botid')}</Radio>
                <Radio value="i_arbeid">{t('p2000:form-ytelse-mottas-basert-paa-i_arbeid')}</Radio>
              </RadioGroup>
              <HGrid gap="4" columns={2}>
                <Input
                  error={_v[_namespace + '-totalbruttobeloepbostedsbasert']?.feilmelding}
                  namespace={_namespace}
                  id={_namespace + '-totalbruttobeloepbostedsbasert'}
                  label={t('p2000:form-ytelse-bruttobeloep-bostedsbasert')}
                  onChanged={(e) => setYtelseProperty("totalbruttobeloepbostedsbasert", removeWhiteSpaceAndReplaceCommas(e), index)}
                  value={replacePeriodsWithCommas(_ytelse?.totalbruttobeloepbostedsbasert ?? '')}
                />
                <Input
                  error={_v[_namespace + '-totalbruttobeloeparbeidsbasert']?.feilmelding}
                  namespace={_namespace}
                  id={_namespace + '-totalbruttobeloeparbeidsbasert'}
                  label={t('p2000:form-ytelse-bruttobeloep-arbeidsrelatert')}
                  onChanged={(e) => setYtelseProperty("totalbruttobeloeparbeidsbasert", removeWhiteSpaceAndReplaceCommas(e), index)}
                  value={replacePeriodsWithCommas(_ytelse?.totalbruttobeloeparbeidsbasert ?? '')}
                />
              </HGrid>
              <HStack>
                <Spacer/>
                {addremovepanel}
              </HStack>
            </VStack>
          </Box>
        </Fragment>
      )
    } else {
      return (
        <Fragment key={_namespace}>
          <Box
            id={'repeatablerow-' + _namespace}
            key={index}
            className={classNames(styles.repeatableBox, {
              [styles.new]: index < 0,
              [styles.error]: hasNamespaceWithErrors(_v, _namespace),
              [styles.withBorder]: true
            })}
            padding="4"
          >
            <VStack gap="4">
              <VStack>
                <HStack gap="4">
                  <Label>{t('p2000:form-ytelse')}</Label>
                  {_ytelse?.status && <Tag size='small' variant='info'>{getStatusLabel(_ytelse?.status)}</Tag>}
                </HStack>
                <BodyLong>
                  {_ytelse?.ytelse === '99' ? _ytelse.annenytelse : getYtelseLabel(_ytelse?.ytelse)}
                </BodyLong>
                <HStack gap="4">
                  <ErrorLabel error={_v[_namespace + '-ytelse']?.feilmelding}/>
                  <ErrorLabel error={_v[_namespace + '-status']?.feilmelding}/>
                </HStack>
              </VStack>

              <HGrid columns={2} gap="4">
                <VStack>
                  <Label>{t('p2000:form-ytelse-startdato-utbetaling')}</Label>
                  <BodyLong>
                    {_ytelse?.startdatoutbetaling ? formatDate(_ytelse?.startdatoutbetaling as string) : <em>Ingen dato oppgitt</em>}
                  </BodyLong>
                </VStack>
                <VStack>
                  <Label>{t('p2000:form-ytelse-sluttdato-utbetaling')}</Label>
                  <BodyLong>
                    {_ytelse?.sluttdatoutbetaling ? formatDate(_ytelse?.sluttdatoutbetaling as string) : <em>Ingen dato oppgitt</em>}
                  </BodyLong>
                </VStack>
              </HGrid>
              <HGrid columns={2} gap="4">
                <VStack>
                  <Label>{t('p2000:form-ytelse-startdato-rett-til-ytelser')}</Label>
                  <BodyLong>
                    {_ytelse?.startdatoretttilytelse ? formatDate(_ytelse?.startdatoretttilytelse as string) : <em>Ingen dato oppgitt</em>}
                  </BodyLong>
                </VStack>
                <Spacer/>
              </HGrid>

              <Table zebraStripes={true}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Valuta</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Beløp siden</Table.HeaderCell>
                    <Table.HeaderCell scope="col" colSpan={2}>Betalingshyppighet</Table.HeaderCell>
                    <Table.HeaderCell scope="col"></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <BeloepRows parentEditMode={false} newBeloepForm={false} setNewBeloepForm={_setNewBeloepForm} setBeloep={setBeloep} parentIndex={index} beloep={_ytelse?.beloep} parentNamespace={_namespace}/>
                </Table.Body>
              </Table>
              {_ytelse?.mottasbasertpaa &&
                <VStack>
                  <Label>{t('p2000:form-ytelse-mottas-basert-paa')}</Label>
                  <BodyLong>
                    {_ytelse?.mottasbasertpaa ? t('p2000:form-ytelse-mottas-basert-paa-' + _ytelse?.mottasbasertpaa) : ''}
                  </BodyLong>
                </VStack>
              }
              {_ytelse?.totalbruttobeloepbostedsbasert &&
                <VStack>
                  <Label>{t('p2000:form-ytelse-bruttobeloep-bostedsbasert')}</Label>
                  <BodyLong>
                    {replacePeriodsWithCommas(_ytelse?.totalbruttobeloepbostedsbasert)}
                  </BodyLong>
                </VStack>
              }
              {_ytelse?.totalbruttobeloeparbeidsbasert &&
                <VStack>
                  <Label>{t('p2000:form-ytelse-bruttobeloep-arbeidsrelatert')}</Label>
                  <BodyLong>
                    {replacePeriodsWithCommas(_ytelse?.totalbruttobeloeparbeidsbasert)}
                  </BodyLong>
                </VStack>
              }
              <HStack>
                <Spacer/>
                {addremovepanel}
              </HStack>
            </VStack>
          </Box>
        </Fragment>
      )
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        {_.isEmpty(ytelser)
          ? (
            <BodyLong>
              <em>{t('p2000:ingen-x-registrert', {x: 'ytelser'})}</em>
            </BodyLong>
          )
          : (
            <>
              {ytelser?.map(renderRow)}
            </>
          )
        }
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-ytelse')?.toLowerCase() })}
              </Button>
            </Box>
          )}
      </VStack>
    </Box>
  )
}

export default Ytelser

