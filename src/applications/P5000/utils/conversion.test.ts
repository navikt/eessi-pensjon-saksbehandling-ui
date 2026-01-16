import { sortItems, mergeP5000ListRows } from 'src/applications/P5000/utils/conversion'
import {P5000ListRows} from "src/declarations/p5000";

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

  it('testing merging P5000ListRows when no rows exist', () => {
    const unmergedItems: P5000ListRows = []
    const mergedItems: P5000ListRows = []

    const generatedItems: P5000ListRows = mergeP5000ListRows({rows: unmergedItems, mergePeriodTypes: undefined, mergePeriodBeregnings: undefined, useGermanRules: false})
    expect(generatedItems).toMatchObject(mergedItems)
  })

  it('testing merging P5000ListRows when two adjacent rows should be merged', () => {
    const unmergedItems: P5000ListRows = [
      {
        key: '01',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),
        sluttdato: new Date(2000, 6, 31),
        dag: '0',
        mnd: '7',
        aar: '0'
      },
      {
        key: '02',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 7, 1),
        sluttdato: new Date(2000, 11, 31),
        dag: '0',
        mnd: '5',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: undefined,
      mergePeriodBeregnings: undefined,
      useGermanRules: false
    })

    // Should merge into one parent row with two sub rows
    expect(generatedItems).toHaveLength(3)
    // Parent row should have combined period
    expect(generatedItems[0].key).toBe('merge-01')
    expect(generatedItems[0].hasSubrows).toBe(true)
    expect(generatedItems[0].startdato).toEqual(new Date(2000, 0, 1))
    expect(generatedItems[0].sluttdato).toEqual(new Date(2000, 11, 31))

    // Sub rows should follow
    expect(generatedItems[1].parentKey).toBe('merge-01')
    expect(generatedItems[2].parentKey).toBe('merge-01')
  })

  it('testing merging P5000ListRows with German rules enabled', () => {
    const unmergedItems: P5000ListRows = [
      {
        key: '01',
        land: 'DE',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),
        sluttdato: new Date(2000, 6, 20),
        dag: '0',
        mnd: '7',
        aar: '0'
      },
      {
        key: '02',
        land: 'DE',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 7, 8),
        sluttdato: new Date(2000, 11, 31),
        dag: '0',
        mnd: '5',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: undefined,
      mergePeriodBeregnings: undefined,
      useGermanRules: true
    })

    // Should merge into one parent row with two sub rows (German rules merge adjacent months)
    expect(generatedItems).toHaveLength(3)
    // Parent row should have combined period
    expect(generatedItems[0].key).toBe('merge-01')
    expect(generatedItems[0].hasSubrows).toBe(true)
    expect(generatedItems[0].startdato).toEqual(new Date(2000, 0, 1))
    expect(generatedItems[0].sluttdato).toEqual(new Date(2000, 11, 31))
    // Sub rows should follow
    expect(generatedItems[1].parentKey).toBe('merge-01')
    expect(generatedItems[2].parentKey).toBe('merge-01')
  })

  it('testing merging P5000ListRows with complex scenario - some rows merged, some not', () => {
    const unmergedItems: P5000ListRows = [
      // Group 1: Three adjacent NO rows that should merge together
      {
        key: '01',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),
        sluttdato: new Date(2000, 3, 30),
        dag: '0',
        mnd: '4',
        aar: '0'
      },
      {
        key: '02',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 4, 1),
        sluttdato: new Date(2000, 7, 31),
        dag: '0',
        mnd: '4',
        aar: '0'
      },
      {
        key: '03',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 8, 1),
        sluttdato: new Date(2000, 11, 31),
        dag: '0',
        mnd: '4',
        aar: '0'
      },
      // Group 2: Single SE row - should NOT merge (different country)
      {
        key: '04',
        land: 'SE',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2001, 0, 1),
        sluttdato: new Date(2001, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Group 3: Two NO rows with gap - should NOT merge (not adjacent)
      {
        key: '05',
        land: 'NO',
        type: 'bosted',
        ytelse: 'annet',
        ordning: 'privat',
        beregning: 'delvis',
        startdato: new Date(2002, 0, 1),
        sluttdato: new Date(2002, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '06',
        land: 'NO',
        type: 'bosted',
        ytelse: 'annet',
        ordning: 'privat',
        beregning: 'delvis',
        startdato: new Date(2003, 0, 1),
        sluttdato: new Date(2003, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Group 4: Two adjacent DK rows that should merge
      {
        key: '07',
        land: 'DK',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'offentlig',
        beregning: 'full',
        startdato: new Date(2004, 0, 1),
        sluttdato: new Date(2004, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '08',
        land: 'DK',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'offentlig',
        beregning: 'full',
        startdato: new Date(2004, 6, 1),
        sluttdato: new Date(2004, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Group 5: Two NO rows different type - should NOT merge
      {
        key: '09',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'uforetrygd',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2005, 0, 1),
        sluttdato: new Date(2005, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '10',
        land: 'NO',
        type: 'bosted',
        ytelse: 'uforetrygd',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2005, 6, 1),
        sluttdato: new Date(2005, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: undefined,
      mergePeriodBeregnings: undefined,
      useGermanRules: false
    })

    // Expected results:
    // - Group 1: 1 parent + 3 sub rows = 4 rows
    // - Group 2: 1 single row (not merged)
    // - Group 3: 2 single rows (not merged due to gap)
    // - Group 4: 1 parent + 2 sub rows = 3 rows
    // - Group 5: 2 single rows (not merged due to different type)
    // Total: 4 + 1 + 2 + 3 + 2 = 12 rows
    expect(generatedItems).toHaveLength(12)

    // Verify Group 1 merged (NO arbeid pensjon)
    const group1Parent = generatedItems.find(r => r.key === 'merge-01')
    expect(group1Parent).toBeDefined()
    expect(group1Parent!.hasSubrows).toBe(true)
    expect(group1Parent!.startdato).toEqual(new Date(2000, 0, 1))
    expect(group1Parent!.sluttdato).toEqual(new Date(2000, 11, 31))
    const group1Children = generatedItems.filter(r => r.parentKey === 'merge-01')
    expect(group1Children).toHaveLength(3)

    // Verify Group 2 not merged (SE single row)
    const group2Row = generatedItems.find(r => r.key === '04')
    expect(group2Row).toBeDefined()
    expect(group2Row!.hasSubrows).toBe(false)

    // Verify Group 3 not merged (gap between rows)
    const group3Row1 = generatedItems.find(r => r.key === '05')
    const group3Row2 = generatedItems.find(r => r.key === '06')
    expect(group3Row1).toBeDefined()
    expect(group3Row2).toBeDefined()
    expect(group3Row1!.hasSubrows).toBe(false)
    expect(group3Row2!.hasSubrows).toBe(false)

    // Verify Group 4 merged (DK arbeid pensjon)
    const group4Parent = generatedItems.find(r => r.key === 'merge-07')
    expect(group4Parent).toBeDefined()
    expect(group4Parent!.hasSubrows).toBe(true)
    expect(group4Parent!.startdato).toEqual(new Date(2004, 0, 1))
    expect(group4Parent!.sluttdato).toEqual(new Date(2004, 11, 31))
    const group4Children = generatedItems.filter(r => r.parentKey === 'merge-07')
    expect(group4Children).toHaveLength(2)

    // Verify Group 5 not merged (different types)
    const group5Row1 = generatedItems.find(r => r.key === '09')
    const group5Row2 = generatedItems.find(r => r.key === '10')
    expect(group5Row1).toBeDefined()
    expect(group5Row2).toBeDefined()
    expect(group5Row1!.hasSubrows).toBe(false)
    expect(group5Row2!.hasSubrows).toBe(false)
  })

  it('testing merging P5000ListRows with mergePeriodTypes - rows with different types but adjacent should be merged', () => {
    const unmergedItems: P5000ListRows = [
      // Two adjacent rows with different types that should merge when mergePeriodTypes includes both
      {
        key: '01',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),
        sluttdato: new Date(2000, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '02',
        land: 'NO',
        type: 'bosted',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 6, 1),
        sluttdato: new Date(2000, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Two adjacent rows with different types NOT in mergePeriodTypes - should NOT merge
      {
        key: '03',
        land: 'SE',
        type: 'selvstendig',
        ytelse: 'pensjon',
        ordning: 'privat',
        beregning: 'delvis',
        startdato: new Date(2001, 0, 1),
        sluttdato: new Date(2001, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '04',
        land: 'SE',
        type: 'annet',
        ytelse: 'pensjon',
        ordning: 'privat',
        beregning: 'delvis',
        startdato: new Date(2001, 6, 1),
        sluttdato: new Date(2001, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: ['arbeid', 'bosted'],
      mergePeriodBeregnings: undefined,
      useGermanRules: false
    })

    // Expected results:
    // - Group 1: 1 parent + 2 sub rows = 3 rows (merged because both types are in mergePeriodTypes)
    // - Group 2: 2 single rows (not merged because types not in mergePeriodTypes)
    // Total: 3 + 2 = 5 rows
    expect(generatedItems).toHaveLength(5)

    // Verify Group 1 merged (different types but both in mergePeriodTypes)
    const group1Parent = generatedItems.find(r => r.key === 'merge-01')
    expect(group1Parent).toBeDefined()
    expect(group1Parent!.hasSubrows).toBe(true)
    expect(group1Parent!.startdato).toEqual(new Date(2000, 0, 1))
    expect(group1Parent!.sluttdato).toEqual(new Date(2000, 11, 31))
    expect(group1Parent!.type).toBe('arbeid, bosted')
    const group1Children = generatedItems.filter(r => r.parentKey === 'merge-01')
    expect(group1Children).toHaveLength(2)

    // Verify Group 2 not merged (types not in mergePeriodTypes)
    const group2Row1 = generatedItems.find(r => r.key === '03')
    const group2Row2 = generatedItems.find(r => r.key === '04')
    expect(group2Row1).toBeDefined()
    expect(group2Row2).toBeDefined()
    expect(group2Row1!.hasSubrows).toBe(false)
    expect(group2Row2!.hasSubrows).toBe(false)
  })

  it('testing merging P5000ListRows with mergePeriodBeregnings - rows with different beregning but adjacent should be merged', () => {
    const unmergedItems: P5000ListRows = [
      // Two adjacent rows with different beregning that should merge when mergePeriodBeregnings includes both
      {
        key: '01',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),
        sluttdato: new Date(2000, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '02',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'delvis',
        startdato: new Date(2000, 6, 1),
        sluttdato: new Date(2000, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Two adjacent rows with different beregning NOT in mergePeriodBeregnings - should NOT merge
      {
        key: '03',
        land: 'SE',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'privat',
        beregning: 'ingen',
        startdato: new Date(2001, 0, 1),
        sluttdato: new Date(2001, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '04',
        land: 'SE',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'privat',
        beregning: 'annet',
        startdato: new Date(2001, 6, 1),
        sluttdato: new Date(2001, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: undefined,
      mergePeriodBeregnings: ['full', 'delvis'],
      useGermanRules: false
    })

    // Expected results:
    // - Group 1: 1 parent + 2 sub rows = 3 rows (merged because both beregning values are in mergePeriodBeregnings)
    // - Group 2: 2 single rows (not merged because beregning values not in mergePeriodBeregnings)
    // Total: 3 + 2 = 5 rows
    expect(generatedItems).toHaveLength(5)

    // Verify Group 1 merged (different beregning but both in mergePeriodBeregnings)
    const group1Parent = generatedItems.find(r => r.key === 'merge-01')
    expect(group1Parent).toBeDefined()
    expect(group1Parent!.hasSubrows).toBe(true)
    expect(group1Parent!.startdato).toEqual(new Date(2000, 0, 1))
    expect(group1Parent!.sluttdato).toEqual(new Date(2000, 11, 31))
    expect(group1Parent!.beregning).toBe('full, delvis')
    const group1Children = generatedItems.filter(r => r.parentKey === 'merge-01')
    expect(group1Children).toHaveLength(2)

    // Verify Group 2 not merged (beregning values not in mergePeriodBeregnings)
    const group2Row1 = generatedItems.find(r => r.key === '03')
    const group2Row2 = generatedItems.find(r => r.key === '04')
    expect(group2Row1).toBeDefined()
    expect(group2Row2).toBeDefined()
    expect(group2Row1!.hasSubrows).toBe(false)
    expect(group2Row2!.hasSubrows).toBe(false)
  })

  it('testing merging P5000ListRows with all properties set - mergePeriodTypes, mergePeriodBeregnings, and useGermanRules', () => {
    const unmergedItems: P5000ListRows = [
      // Group 1: Two DE rows with different types and beregning, adjacent months (German rules) - should merge
      {
        key: '01',
        land: 'DE',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),
        sluttdato: new Date(2000, 5, 20),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '02',
        land: 'DE',
        type: 'bosted',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'delvis',
        startdato: new Date(2000, 6, 8),
        sluttdato: new Date(2000, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Group 2: Two NO rows with different types and beregning (all in merge arrays) - should merge (non-German rules apply)
      {
        key: '03',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'offentlig',
        beregning: 'full',
        startdato: new Date(2001, 0, 1),
        sluttdato: new Date(2001, 5, 30),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '04',
        land: 'NO',
        type: 'bosted',
        ytelse: 'pensjon',
        ordning: 'offentlig',
        beregning: 'delvis',
        startdato: new Date(2001, 6, 1),
        sluttdato: new Date(2001, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Group 3: Two DE rows with types NOT in mergePeriodTypes - should NOT merge
      {
        key: '05',
        land: 'DE',
        type: 'selvstendig',
        ytelse: 'pensjon',
        ordning: 'privat',
        beregning: 'full',
        startdato: new Date(2002, 0, 1),
        sluttdato: new Date(2002, 5, 20),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '06',
        land: 'DE',
        type: 'annet',
        ytelse: 'pensjon',
        ordning: 'privat',
        beregning: 'delvis',
        startdato: new Date(2002, 6, 8),
        sluttdato: new Date(2002, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      // Group 4: Two DE rows with beregning NOT in mergePeriodBeregnings - should NOT merge
      {
        key: '07',
        land: 'DE',
        type: 'arbeid',
        ytelse: 'uforetrygd',
        ordning: 'folketrygd',
        beregning: 'ingen',
        startdato: new Date(2003, 0, 1),
        sluttdato: new Date(2003, 5, 20),
        dag: '0',
        mnd: '6',
        aar: '0'
      },
      {
        key: '08',
        land: 'DE',
        type: 'bosted',
        ytelse: 'uforetrygd',
        ordning: 'folketrygd',
        beregning: 'annet',
        startdato: new Date(2003, 6, 8),
        sluttdato: new Date(2003, 11, 31),
        dag: '0',
        mnd: '6',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: ['arbeid', 'bosted'],
      mergePeriodBeregnings: ['full', 'delvis'],
      useGermanRules: true
    })

    // Expected results:
    // - Group 1: 1 parent + 2 sub rows = 3 rows (merged - DE with German rules, types and beregning in merge arrays)
    // - Group 2: 1 parent + 2 sub rows = 3 rows (merged - NO with standard rules, types and beregning in merge arrays)
    // - Group 3: 2 single rows (not merged - types not in mergePeriodTypes)
    // - Group 4: 2 single rows (not merged - beregning not in mergePeriodBeregnings)
    // Total: 3 + 3 + 2 + 2 = 10 rows
    expect(generatedItems).toHaveLength(10)

    // Verify Group 1 merged (DE with German rules)
    const group1Parent = generatedItems.find(r => r.key === 'merge-01')
    expect(group1Parent).toBeDefined()
    expect(group1Parent!.hasSubrows).toBe(true)
    expect(group1Parent!.land).toBe('DE')
    expect(group1Parent!.startdato).toEqual(new Date(2000, 0, 1))
    expect(group1Parent!.sluttdato).toEqual(new Date(2000, 11, 31))
    expect(group1Parent!.type).toBe('arbeid, bosted')
    expect(group1Parent!.beregning).toBe('full, delvis')
    const group1Children = generatedItems.filter(r => r.parentKey === 'merge-01')
    expect(group1Children).toHaveLength(2)

    // Verify Group 2 merged (NO with standard rules)
    const group2Parent = generatedItems.find(r => r.key === 'merge-03')
    expect(group2Parent).toBeDefined()
    expect(group2Parent!.hasSubrows).toBe(true)
    expect(group2Parent!.land).toBe('NO')
    expect(group2Parent!.startdato).toEqual(new Date(2001, 0, 1))
    expect(group2Parent!.sluttdato).toEqual(new Date(2001, 11, 31))
    expect(group2Parent!.type).toBe('arbeid, bosted')
    expect(group2Parent!.beregning).toBe('full, delvis')
    const group2Children = generatedItems.filter(r => r.parentKey === 'merge-03')
    expect(group2Children).toHaveLength(2)

    // Verify Group 3 not merged (types not in mergePeriodTypes)
    const group3Row1 = generatedItems.find(r => r.key === '05')
    const group3Row2 = generatedItems.find(r => r.key === '06')
    expect(group3Row1).toBeDefined()
    expect(group3Row2).toBeDefined()
    expect(group3Row1!.hasSubrows).toBe(false)
    expect(group3Row2!.hasSubrows).toBe(false)

    // Verify Group 4 not merged (beregning not in mergePeriodBeregnings)
    const group4Row1 = generatedItems.find(r => r.key === '07')
    const group4Row2 = generatedItems.find(r => r.key === '08')
    expect(group4Row1).toBeDefined()
    expect(group4Row2).toBeDefined()
    expect(group4Row1!.hasSubrows).toBe(false)
    expect(group4Row2!.hasSubrows).toBe(false)
  })

  it('testing merging P5000ListRows with two adjacent rows - 2 month + 3 month periods with correct aar, mnd, dag values', () => {
    const unmergedItems: P5000ListRows = [
      {
        key: '01',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 0, 1),  // Jan 1, 2000
        sluttdato: new Date(2000, 1, 29), // Feb 29, 2000 (leap year)
        dag: '0',
        mnd: '2',
        aar: '0'
      },
      {
        key: '02',
        land: 'NO',
        type: 'arbeid',
        ytelse: 'pensjon',
        ordning: 'folketrygd',
        beregning: 'full',
        startdato: new Date(2000, 2, 1),  // Mar 1, 2000
        sluttdato: new Date(2000, 4, 31), // May 31, 2000
        dag: '0',
        mnd: '3',
        aar: '0'
      }
    ] as P5000ListRows

    const generatedItems: P5000ListRows = mergeP5000ListRows({
      rows: unmergedItems,
      mergePeriodTypes: undefined,
      mergePeriodBeregnings: undefined,
      useGermanRules: false
    })

    // Should merge into one parent row with two sub rows
    expect(generatedItems).toHaveLength(3)

    // Parent row should have combined period
    const parentRow = generatedItems.find(r => r.key === 'merge-01')
    expect(parentRow).toBeDefined()
    expect(parentRow!.hasSubrows).toBe(true)
    expect(parentRow!.startdato).toEqual(new Date(2000, 0, 1))
    expect(parentRow!.sluttdato).toEqual(new Date(2000, 4, 31))

    // Verify correct aar, mnd, dag values for merged parent (5 months total)
    expect(parentRow!.aar).toBe('')
    expect(parentRow!.mnd).toBe(5)
    expect(parentRow!.dag).toBe('')

    // Verify sub rows retain their original values
    const subRows = generatedItems.filter(r => r.parentKey === 'merge-01')
    expect(subRows).toHaveLength(2)

    const subRow1 = subRows.find(r => r.key === '01')
    expect(subRow1).toBeDefined()
    expect(subRow1!.dag).toBe('0')
    expect(subRow1!.mnd).toBe('2')
    expect(subRow1!.aar).toBe('0')

    const subRow2 = subRows.find(r => r.key === '02')
    expect(subRow2).toBeDefined()
    expect(subRow2!.dag).toBe('0')
    expect(subRow2!.mnd).toBe('3')
    expect(subRow2!.aar).toBe('0')
  })
})
