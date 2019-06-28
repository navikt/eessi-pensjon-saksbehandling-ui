import React, { useState } from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import File from 'components/ui/File/File'
import { NavFrontendSpinner, Input, Checkbox } from 'components/ui/Nav'

import './TableSorter.css'

const TableSorter = (props) => {
  const { t, actions, sort, columns, items, onItemClicked, loadingJoarkFile, loadingJoarkPreviewFile, previewFile, onSelectedItemChange } = props
  const [ _sort, setSort ] = useState(sort || { column: '', order: '' })
  const [ _columns, setColumns ] = useState(columns)

  var columnNames = Object.keys(_columns)
  var filters = {}

  const sortColumn = (column) => {
    var newSortOrder = _sort.order === 'asc' ? 'desc' : 'asc'
    if (_sort.column !== column) {
      newSortOrder = _columns[column].defaultSortOrder
    }
    setSort({ column: column, order: newSortOrder })
  }

  const sortClass = (column) => {
    var ascOrDesc = _sort.order === 'asc' ? 'headerSortAsc' : 'headerSortDesc'
    return _sort.column === column ? ascOrDesc : ''
  }

  const rows = () => {
    const filteredItems = _.filter(items, (item) => {
      return _.every(columnNames, (c) => {
        if (_columns[c].filterText) {
          return item[c].match(_columns[c].filterText) ? item[c] : null
        } else {
          return item[c]
        }
      })
    })

    var sortedItems = _.sortBy(filteredItems, _sort.column)
    if (_sort.order === 'desc') {
      sortedItems.reverse()
    }

    var onRowClick = (item) => {
      console.log(item)
    }

    return sortedItems.map((item, index) => {
      let background = index % 2 === 0 ? 'white' : 'whitesmoke'
      if (item.focused) background = 'lightsteelblue'

      return <tr
        key={item.id}
        style={{ background: background }}>
        { columnNames.map((column, index) => {
          const value = item[column]
          const key = column + '-' + index
          switch (column) {
            case 'name':
            case 'tema':
            return <td key={key}>{value}</td>
            case 'date':
            return <td key={key}>{value.toLocaleDateString()}</td>
            case 'varianter':
            return <td key={key}>
              {value.map(variant => {
                return <div className='d-flex'>
                  <Checkbox
                    className='c-ui-tablesorter__checkbox'
                    onChange={(e) => onSelectedItemChange(item, e.target.checked, variant)}
                    checked={item.selected && item.variant === variant} />
                  <a key={variant} href='#' onClick={(e) => {
                    e.preventDefault();
                    onItemClicked(item, variant)
                  }}>{variant}</a>
                </div>
              })}
            </td>
            default:
            return null
          }
        })}
      </tr>
    })
  }

  const header = () => {
    return <React.Fragment>
      {columnNames.map((c) => {
        return <th key={c}
          onClick={() => sortColumn(c)}
          className={'header ' + sortClass(c)}>
          {_columns[c].name}
        </th>
      })}
    </React.Fragment>
  }

  const handleFilterTextChange = (column, newValue) => {
    let newColumns = _.cloneDeep(_columns)
    newColumns[column].filterText = newValue
    setColumns(newColumns)
  }

  const filterInputs = () => {
    return <React.Fragment>
      {columnNames.map((c) => {
        return <td key={c}>
          <Input
            className='c-ui-tablesorter__sort-input'
            label=''
            value={_columns[c].filterText}
            onChange={(e) => handleFilterTextChange(c, e.target.value)} />
        </td>
      })}
    </React.Fragment>
  }

  const onPreviewFile = () => {
    actions.openModal({
      modalContent: <div style={{ cursor: 'pointer' }} onClick={() => actions.closeModal()}>
        <File file={previewFile} width={400} height={600} />
      </div>
    })
  }

  return <div className='c-ui-tablesorter'>
    {loadingJoarkFile ? <NavFrontendSpinner type='XS' /> : null}
    <table cellSpacing='0' className='c-ui-tablesorter__table'>
      <thead>
        <tr>{ header() }</tr>
        <tr>{ filterInputs() }</tr>
      </thead>
      <tbody>{ rows() }</tbody>
    </table>
    <div className='c-ui-tablesorter__preview'>
      {loadingJoarkPreviewFile ? <div>
        <NavFrontendSpinner type='XS' />
        <span className='pl-2'>{t('ui:loading')}</span>
      </div>
        : previewFile ? <File file={previewFile} addLink animate previewLink
          width={141.4} height={200} scale={1.0}
          onPreviewDocument={onPreviewFile}
          onClick={onPreviewFile} /> : null}
    </div>
  </div>
}

TableSorter.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  sort: PT.object.isRequired,
  columns: PT.object.isRequired,
  items: PT.array.isRequired,
  onItemClicked: PT.func.isRequired,
  onSelectedItemChange: PT.func.isRequired,
  loadingJoarkFile: PT.bool.isRequired,
  previewFile: PT.object
}

export default TableSorter
