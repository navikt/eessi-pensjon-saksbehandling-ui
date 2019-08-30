import React from 'react'
import TableSorter from './TableSorter'

describe('components/TableSorter/TabbleSorter', () => {

  let wrapper
  const initialMockProps = {
    columns: {
      name: { name: 'ui:title', filterText: '', defaultSortOrder: '' },
      tema: { name: 'ui:tema', filterText: '', defaultSortOrder: '' },
      date: { name: 'ui:date', filterText: '', defaultSortOrder: '' },
      varianter: { name: 'ui:variant', filterText: '', defaultSortOrder: '' }
    },
    items: [{
      raw: {},
      id: '1',
      name: 'name',
      tema: 'tema',
      date: new Date(1,1,1970),
      varianter: [{
        label: 'label',
        variant: 'variant',
        selected: false,
        focused: false
      }]
    }],
    loadingJoarkFile: false,
    onItemClicked: jest.fn(),
    onSelectedItemChange: jest.fn(),
    sort: {
      column: 'name',
      order: 'desc'
    },
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<TableSorter {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure: loading', () => {
    expect(wrapper.exists('div.c-tablesorter')).toBeTruthy()
  })


})
