import React, { useState } from 'react'
import _ from 'lodash'

const TableSorter = (props) => {

  const { initialItems, config, items } = props
  const [ sort, setSort ] = useState(config.sort || { column: '', order: '' })
  const [ columns, setColumns ] = useState(config.columns)

  var columnNames = Object.keys(columns)
  var filters = {}

  const sortColumn = (column) => {
    var newSortOrder = sort.order === 'asc' ? 'desc' : 'asc'
    if (sort.column !== column) {
      newSortOrder = columns[column].defaultSortOrder
    }
    setSort({ column: column, order: newSortOrder })
  }

  const sortClass = (column) => {
    var ascOrDesc = sort.order === 'asc' ? 'headerSortAsc' : 'headerSortDesc'
    return sort.column === column ? ascOrDesc : ''
  }

  const rows = () => {

    const filteredItems = _.filter(items, (item) => {
      return _.every(columnNames, (c) => {
        if (columns[c].filterText) {
          return item[c].match(columns[c].filterText) ? item[c] : null
        } else {
          return item[c]
        }
      })
    })

    var sortedItems = _.sortBy(filteredItems, sort.column)
    if (sort.order === 'desc') {
      sortedItems.reverse()
    }

    var onRowClick = (item) => {
      console.log(item)
    }

    return sortedItems.map((item, index) => {
      return <tr
        key={item.id}
        style={{background: index % 2 === 0 ? 'white' : 'whitesmoke'}}
        onClick={() => onRowClick(item)}>
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
          {columns[c].name}
        </th>
    })
  }

  const handleFilterTextChange = (column, newValue) => {
    let newColumns = _.cloneDeep(columns)
    newColumns[column].filterText = newValue
    setColumns(newColumns)
  }

  const filterInputs = () => {
    return columnNames.map((c) => {
      return <td>
        <input type='text'
          value={columns[c].filterText}
          onChange={(e) => handleFilterTextChange(c, e.target.value)} />
      </td>
    })
  }

  return <table cellSpacing='0' className='tablesorter'>
    <thead>
      <tr>{ header() }</tr>
      <tr>{ filterInputs() }</tr>
    </thead>
    <tbody>{ rows() } </tbody>
  </table>
}

export default TableSorter
