import React, { useState } from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import File from 'components/ui/File/File'
import { NavFrontendSpinner, Checkbox } from 'components/ui/Nav'

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
      if (item.selected) background = 'lightblue'
      if (item.focused) background = 'lightsteelblue'

      return <tr
        key={item.id}
        style={{ background: background }}>

        <td className='checkbox'>
          <input type='checkbox'
            onChange={(e) => onItemSelected(item, e.target.checked)}
            checked={item.selected} />
        </td>
        { columnNames.map((c, index) => {
          if (typeof item[c] === 'string') {
            if (c === 'name') {
              return <td key={c + '-' + index}><a href='#'
                onClick={(e) => { e.preventDefault(); onItemClicked(item) }}>{item[c]}</a></td>
            }
            return <td key={c + '-' + index}>{item[c]}</td>
          }
          if (item[c].toLocaleDateString) {
            const dateString = item[c].toLocaleDateString()
            return <td key={c + '-' + index}>{dateString}</td>
          }
        })}
      </tr>
    })
  }

  const header = () => {
    return <React.Fragment>
      <th className='checkbox' />
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

  const onItemSelected = (item, checked) => {
    onSelectedItemChange(item, checked)
  }

  const filterInputs = () => {
    return <React.Fragment>
      <td className='checkbox'>
        {loadingJoarkFile ? <NavFrontendSpinner type='XS' /> : null}
      </td>
      {columnNames.map((c) => {
        return <td key={c}>
          <input type='text'
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
  onSelectedItemsChange: PT.func.isRequired,
  loadingJoarkFile: PT.bool.isRequired,
  previewFile: PT.object
}

export default TableSorter
