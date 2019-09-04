import React, { useState } from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { Checkbox, EtikettLiten, Input, NavFrontendSpinner, Normaltekst, UndertekstBold } from 'components/Nav'

import './TableSorter.css'

const TableSorter = (props) => {
  const { t, sort, columns, items, onItemClicked, loadingJoarkFile, loadingJoarkPreviewFile, onSelectedItemChange } = props
  const [_sort, setSort] = useState(sort || { column: '', order: '' })
  const [_columns, setColumns] = useState(columns)
  const [seeFilters, setSeeFilters] = useState(false)

  const columnNames = Object.keys(_columns)
  const sortOrder = {
    '': 'asc',
    asc: 'desc',
    desc: ''
  }

  const sortColumn = (column) => {
    var newSortOrder = sortOrder[_sort.order]
    if (_sort.column !== column) {
      newSortOrder = _columns[column].defaultSortOrder
    }
    setSort({ column: column, order: newSortOrder })
  }

  const sortClass = (column) => {
    var ascOrDesc = _sort.order === 'asc' ? 'headerSortAsc' : _sort.order === 'desc' ? 'headerSortDesc' : ''
    return _sort.column === column ? ascOrDesc : ''
  }

  const rows = () => {
    const filteredItems = _.filter(items, (item) => {
      return _.every(columnNames, (column) => {
        const filterText = _columns[column].filterText.toLowerCase()
        switch (column) {
          case 'varianter':
            return filterText ? item[column].find(it => it.label.toLowerCase().match(filterText)) : true
          case 'date':
            return filterText ? item[column].toLocaleDateString().match(filterText) : true
          default:
            return filterText ? item[column].toLowerCase().match(filterText) : true
        }
      })
    })

    var sortedItems = _.sortBy(filteredItems, _sort.column)
    if (_sort.order === 'desc') {
      sortedItems.reverse()
    }

    const convertSomeNonAlphanumericCharactersToUnderscore = (text) => {
      return text.replace(/[ .\-\\(\\)]/g, '_')
    }

    return sortedItems.map((item, index) => {
      const background = index % 2 === 0 ? 'white' : 'whitesmoke'

      return (
        <tr
          key={index}
          style={{ background: background }}
        >
          <td />
          {columnNames.map((column, index2) => {
            const value = item[column]
            switch (column) {
              case 'name':
                return (
                  <td key={index2}>
                    <Normaltekst>{value}</Normaltekst>
                  </td>
                )
              case 'tema':
                return (
                  <td key={index2}>
                    <EtikettLiten>{value}</EtikettLiten>
                  </td>
                )
              case 'date':
                return (
                  <td key={index2}>
                    <Normaltekst>{value ? value.toLocaleDateString() : t('ui:unknown')}</Normaltekst>
                  </td>
                )
              case 'varianter':
                return (
                  <td key={index2}>
                    {value.map(variant => {
                      return (
                        <div
                          key={variant.label}
                          className='c-tablesorter__subcell'
                        >
                          <Checkbox
                            label=''
                            id={'c-tablesorter__checkbox-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
                              convertSomeNonAlphanumericCharactersToUnderscore(variant.label)}
                            className='c-tablesorter__checkbox'
                            onChange={(e) => onSelectedItemChange(item, e.target.checked, variant.variant)}
                            checked={variant.selected}
                          />
                          <a
                            href='#item'
                            onClick={(e) => {
                              e.preventDefault()
                              onItemClicked(item, variant.variant)
                            }}
                          >
                            <Normaltekst>{variant.label}</Normaltekst>
                          </a>
                        </div>
                      )
                    })}
                  </td>
                )
              default:
                return null
            }
          })}
        </tr>
      )
    })
  }

  const header = () => {
    return (
      <>
        <th>
          <Checkbox
            id='c-tablesorter__seefilters-checkbox-id'
            className='c-tablesorter__checkbox'
            label=''
            checked={seeFilters}
            onChange={() => setSeeFilters(!seeFilters)}
          />
        </th>
        {columnNames.map((column) => {
          return (
            <th
              key={column}
              onClick={() => sortColumn(column)}
              className={'header ' + sortClass(column)}
            >
              <UndertekstBold>{_columns[column].name}</UndertekstBold>
            </th>
          )
        })}
      </>
    )
  }

  const handleFilterTextChange = (column, newValue) => {
    const newColumns = _.cloneDeep(_columns)
    newColumns[column].filterText = newValue
    setColumns(newColumns)
  }

  const filterInputs = () => {
    return (
      <>
        <td />
        {columnNames.map((column) => {
          return (
            <td key={column}>
              <Input
                id={'c-tablesorter__sort-' + column + '-input-id'}
                className='c-tablesorter__sort-input'
                label=''
                value={_columns[column].filterText}
                onChange={(e) => handleFilterTextChange(column, e.target.value)}
              />
            </td>
          )
        })}
      </>
    )
  }

  return (
    <div className='c-tablesorter'>
      <div className='c-tablesorter__status'>
        {loadingJoarkFile ? (
          <div>
            <NavFrontendSpinner type='XS' />
            <span className='pl-2'>{t('ui:loading')}</span>
          </div>
        ) : null}
        {loadingJoarkPreviewFile ? (
          <div>
            <NavFrontendSpinner type='XS' />
            <span className='pl-2'>{t('ui:loading')}</span>
          </div>
        ) : null}
      </div>
      <div className='c-tablesorter__content'>
        <table cellSpacing='0' className='c-tablesorter__table'>
          <thead>
            <tr>{header()}</tr>
            {seeFilters ? <tr>{filterInputs()}</tr> : null}
          </thead>
          <tbody>{rows()}</tbody>
        </table>
      </div>
    </div>
  )
}

TableSorter.propTypes = {
  t: PT.func.isRequired,
  sort: PT.object.isRequired,
  columns: PT.object.isRequired,
  items: PT.array.isRequired,
  onItemClicked: PT.func.isRequired,
  onSelectedItemChange: PT.func.isRequired,
  loadingJoarkFile: PT.bool.isRequired
}

export default TableSorter
