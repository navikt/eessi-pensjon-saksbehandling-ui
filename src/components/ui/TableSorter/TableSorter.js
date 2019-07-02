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
  const [ seeFilters, setSeeFilters ] = useState(false)

  var columnNames = Object.keys(_columns)

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
      return _.every(columnNames, (column) => {
        const filterText = _columns[column].filterText
        switch (column) {
          case 'varianter':
            return filterText ? item[column].find(it => it.match(filterText)) : true
          case 'date':
            return filterText ? item[column].toLocaleDateString().match(filterText) : true
          default:
            return filterText ? item[column].match(filterText) : true
        }
      })
    })

    var sortedItems = _.sortBy(filteredItems, _sort.column)
    if (_sort.order === 'desc') {
      sortedItems.reverse()
    }

    return sortedItems.map((item, index) => {
      let background = index % 2 === 0 ? 'white' : 'whitesmoke'
      if (item.focused) background = 'lightsteelblue'

      return <tr
        key={index}
        style={{ background: background }}>
        { columnNames.map((column, index2) => {
          const value = item[column]
          switch (column) {
            case 'name':
            case 'tema':
              return <td key={index2}>{value}</td>
            case 'date':
              return <td key={index2}>{value ? value.toLocaleDateString() : t('ui:unknown')}</td>
            case 'varianter':
              return <td key={index2}>
                {value.map(variant => {
                  return <div key={variant.label} className='d-flex'>
                    <Checkbox
                      label=''
                      className='c-ui-tablesorter__checkbox'
                      onChange={(e) => onSelectedItemChange(item, e.target.checked, variant.label)}
                      checked={variant.selected} />
                    <a href='#item' onClick={(e) => {
                      e.preventDefault()
                      onItemClicked(item, variant.label)
                    }}>{variant.label}</a>
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
    <div className='c-ui-tablesorter__status'>
      <Checkbox label='' checked={seeFilters} onChange={() => setSeeFilters(!seeFilters)}/>
      {loadingJoarkFile ? <NavFrontendSpinner type='XS' /> : null}
    </div>
    <div className='c-ui-tablesorter__content'>
      <table cellSpacing='0' className='c-ui-tablesorter__table'>
        <thead>
          <tr>{ header() }</tr>
          {seeFilters ? <tr>{ filterInputs() }</tr> : null}
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
