import { render } from '@testing-library/react'
import ValidationBox, { ValidationBoxProps } from './ValidationBox'
import { Validation } from 'src/declarations/app'
import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'

describe('ValidationBox', () => {
  const defaultProps: ValidationBoxProps = {
    validation: {},
    heading: 'Du må rette følgende feil:'
  }

  describe('console errors and warnings', () => {
    it('renders without console errors or warnings when validation is empty', () => {
      const tracker = trackConsoleIssues()

      render(<ValidationBox {...defaultProps} />)

      assertNoConsoleIssues(tracker)
    })

    it('renders without console errors or warnings when there are validation errors', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Dette feltet er påkrevd', skjemaelementId: 'field1' },
        field2: { feilmelding: 'Ugyldig format', skjemaelementId: 'field2' }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      assertNoConsoleIssues(tracker)
    })

    it('renders without console errors on rerender', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Feil', skjemaelementId: 'field1' }
      }

      const { rerender } = render(<ValidationBox {...defaultProps} />)
      rerender(<ValidationBox {...defaultProps} validation={validation} />)

      assertNoConsoleIssues(tracker)
    })

    it('renders without console errors when skjemaelementId is null', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Generell feil', skjemaelementId: null as any }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      assertNoConsoleIssues(tracker)
    })
  })
})

