import React, { useState } from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import File from 'components/ui/File/File'
import { NavFrontendSpinner } from 'components/ui/Nav'

import './TableSorter.css'

const TableSorter = (props) => {

  const { t, actions, sort, columns, items, onItemClicked, loadingJoarkFile, previewFile } = props
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
      return <tr
        key={item.id}
        style={{background: index % 2 === 0 ? 'white' : 'whitesmoke'}}
        onClick={() => onItemClicked(item)}>
        { columnNames.map((c) => {
          if (typeof item[c] === 'string') {
            return <td>{item[c]}</td>
          }
          if (item[c].toLocaleDateString) {
            return <td>{item[c].toLocaleDateString()}</td>
          }
        })}
      </tr>
    })
  }

  const header = () => {
    return columnNames.map((c) => {
      return <th
        onClick={() => sortColumn(c)}
        className={"header " + sortClass(c)}>
          {_columns[c].name}
        </th>
    })
  }

  const handleFilterTextChange = (column, newValue) => {
    let newColumns = _.cloneDeep(_columns)
    newColumns[column].filterText = newValue
    setColumns(newColumns)
  }

  const filterInputs = () => {
    return columnNames.map((c) => {
      return <td>
        <input type='text'
          value={_columns[c].filterText}
          onChange={(e) => handleFilterTextChange(c, e.target.value)} />
      </td>
    })
  }

  const onPreviewFile = () => {
    actions.openModal({
      modalContent: <div style={{ cursor: 'pointer' }} onClick={() => actions.closeModal()}>
        <File file={previewFile} width={400} height={600}/>
      </div>
    })
  }

  return <div className='c-ui-tablesorter'>
    <table cellSpacing='0' className='c-ui-tablesorter__table'>
      <thead>
        <tr>{ header() }</tr>
        <tr>{ filterInputs() }</tr>
      </thead>
      <tbody>{ rows() } </tbody>
    </table>
    <div className='c-ui-tablesorter__preview'>
      {loadingJoarkFile? <div>
        <NavFrontendSpinner type='XS' />
        <span>{t('ui:loading')}</span>
      </div> : null}
      {previewFile ? <File file={previewFile} addLink animate previewLink
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
  loadingJoarkFile: PT.bool.isRequired,
  previewFile: PT.object
}

export default TableSorter
