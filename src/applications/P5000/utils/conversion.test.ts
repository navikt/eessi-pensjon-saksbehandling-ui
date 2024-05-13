import { sortItems } from 'src/applications/P5000/utils/conversion'
//import { P5000ListRow } from 'declarations/p5000'

describe('applications/P5000/utils/conversion', () => {

  it('testing sort that does properly handle merged periods', () => {
    const expectedItems: Array<any> = [
      {key: '01', startdato: new Date(1900, 1, 1), title: 'A'},
      {key: '02', startdato: new Date(1901, 1, 1), title: 'B'},
      {key: '03', startdato: new Date(1902, 1, 1), title: 'C'},
      {key: '04', startdato: new Date(1903, 1, 1), title: 'D'},
      {key: '04_01', parentKey: '04', startdato: new Date(1903, 1, 1), title: 'D_A'},
      {key: '04_02', parentKey: '04', startdato: new Date(1903, 2, 1), title: 'D_B'},
      {key: '04_03', parentKey: '04', startdato: new Date(1903, 3, 1), title: 'D_C'},
      {key: '04_04', parentKey: '04', startdato: new Date(1903, 4, 1), title: 'D_D'},
      {key: '05', startdato: new Date(1904, 1, 1), title: 'E'},
      {key: '06', startdato: new Date(1905, 1, 1), title: 'F'},
      {key: '07', startdato: new Date(1906, 1, 1), title: 'G'},
      {key: '07_01', parentKey: '07', startdato: new Date(1906, 1, 1), title: 'G_A'},
      {key: '07_02', parentKey: '07', startdato: new Date(1906, 2, 1), title: 'G_B'},
      {key: '08', startdato: new Date(1907, 1, 1), title: 'H'},
      {key: '09', startdato: new Date(1908, 1, 1), title: 'I'},
      {key: '10', startdato: new Date(1909, 1, 1), title: 'J'},
      {key: '11', startdato: new Date(1910, 1, 1), title: 'K'}
    ] as Array<any>

    const unsortedItems: Array<any> = [
      {key: '04_02', parentKey: '04', startdato: new Date(1903, 2, 1), title: 'D_B'},
      {key: '03', startdato: new Date(1902, 1, 1), title: 'C'},
      {key: '11', startdato: new Date(1910, 1, 1), title: 'K'},
      {key: '07_02', parentKey: '07', startdato: new Date(1906, 2, 1), title: 'G_B'},
      {key: '05', startdato: new Date(1904, 1, 1), title: 'E'},
      {key: '04_04', parentKey: '04', startdato: new Date(1903, 4, 1), title: 'D_D'},
      {key: '07', startdato: new Date(1906, 1, 1), title: 'G'},
      {key: '07_01', parentKey: '07', startdato: new Date(1906, 1, 1), title: 'G_A'},
      {key: '08', startdato: new Date(1907, 1, 1), title: 'H'},
      {key: '04', startdato: new Date(1903, 1, 1), title: 'D'},
      {key: '04_01', parentKey: '04', startdato: new Date(1903, 1, 1), title: 'D_A'},
      {key: '10', startdato: new Date(1909, 1, 1), title: 'J'},
      {key: '01', startdato: new Date(1900, 1, 1), title: 'A'},
      {key: '04_03', parentKey: '04', startdato: new Date(1903, 3, 1), title: 'D_C'},
      {key: '02', startdato: new Date(1901, 1, 1), title: 'B'},
      {key: '06', startdato: new Date(1905, 1, 1), title: 'F'},
      {key: '09', startdato: new Date(1908, 1, 1), title: 'I'}
    ] as Array<any>

    const generatedItems = sortItems(unsortedItems)
    expect(generatedItems).toMatchObject(expectedItems)
  })
})
