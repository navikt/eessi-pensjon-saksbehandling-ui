import { render, screen, fireEvent } from '@testing-library/react'
import ValidationBox, { ValidationBoxProps } from './ValidationBox'
import { Validation } from 'src/declarations/app'
import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'

describe('ValidationBox', () => {
  const defaultProps: ValidationBoxProps = {
    validation: {},
    heading: 'Du må rette følgende feil:'
  }

  describe('rendering', () => {
    it('renders nothing when validation is empty', () => {
      const tracker = trackConsoleIssues()
      const { container } = render(<ValidationBox {...defaultProps} />)
      expect(container.firstChild).toBeNull()
      assertNoConsoleIssues(tracker)
    })

    it('renders nothing when all validations are valid (notnull)', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'notnull', skjemaelementId: 'field1' },
        field2: { feilmelding: 'notnull', skjemaelementId: 'field2' }
      }
      const { container } = render(<ValidationBox {...defaultProps} validation={validation} />)
      expect(container.firstChild).toBeNull()
      assertNoConsoleIssues(tracker)
    })

    it('renders nothing when all validations are valid (ok)', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'ok', skjemaelementId: 'field1' },
        field2: { feilmelding: 'ok', skjemaelementId: 'field2' }
      }
      const { container } = render(<ValidationBox {...defaultProps} validation={validation} />)
      expect(container.firstChild).toBeNull()
      assertNoConsoleIssues(tracker)
    })

    it('renders nothing when all validations are valid (error)', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'error', skjemaelementId: 'field1' }
      }
      const { container } = render(<ValidationBox {...defaultProps} validation={validation} />)
      expect(container.firstChild).toBeNull()
      assertNoConsoleIssues(tracker)
    })

    it('renders error summary when there are validation errors', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Dette feltet er påkrevd', skjemaelementId: 'field1' }
      }
      render(<ValidationBox {...defaultProps} validation={validation} />)

      expect(screen.getByTestId('validationBox')).toBeInTheDocument()
      expect(screen.getByText('Du må rette følgende feil:')).toBeInTheDocument()
      expect(screen.getByText('Dette feltet er påkrevd')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('renders multiple validation errors', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Feltet er påkrevd', skjemaelementId: 'field1' },
        field2: { feilmelding: 'Ugyldig format', skjemaelementId: 'field2' },
        field3: { feilmelding: 'Verdien er for lav', skjemaelementId: 'field3' }
      }
      render(<ValidationBox {...defaultProps} validation={validation} />)

      expect(screen.getByText('Feltet er påkrevd')).toBeInTheDocument()
      expect(screen.getByText('Ugyldig format')).toBeInTheDocument()
      expect(screen.getByText('Verdien er for lav')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('filters out undefined validation entries', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Feil her', skjemaelementId: 'field1' },
        field2: undefined,
        field3: { feilmelding: 'En annen feil', skjemaelementId: 'field3' }
      }
      render(<ValidationBox {...defaultProps} validation={validation} />)

      expect(screen.getByText('Feil her')).toBeInTheDocument()
      expect(screen.getByText('En annen feil')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('filters out special validation values (notnull, error, ok)', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Real error', skjemaelementId: 'field1' },
        field2: { feilmelding: 'notnull', skjemaelementId: 'field2' },
        field3: { feilmelding: 'error', skjemaelementId: 'field3' },
        field4: { feilmelding: 'ok', skjemaelementId: 'field4' }
      }
      render(<ValidationBox {...defaultProps} validation={validation} />)

      expect(screen.getByText('Real error')).toBeInTheDocument()
      expect(screen.queryByText('notnull')).not.toBeInTheDocument()
      expect(screen.queryByText('error')).not.toBeInTheDocument()
      expect(screen.queryByText('ok')).not.toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('renders with custom heading', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Feil', skjemaelementId: 'field1' }
      }
      render(<ValidationBox validation={validation} heading="Egendefinert overskrift" />)

      expect(screen.getByText('Egendefinert overskrift')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })
  })

  describe('interaction', () => {
    beforeEach(() => {
      // Create a mock element in the DOM that we can focus/scroll to
      const mockElement = document.createElement('input')
      mockElement.id = 'field1'
      mockElement.focus = jest.fn()
      mockElement.scrollIntoView = jest.fn()
      document.body.appendChild(mockElement)
    })

    afterEach(() => {
      // Clean up
      const mockElement = document.getElementById('field1')
      if (mockElement) {
        document.body.removeChild(mockElement)
      }
    })

    it('focuses and scrolls to element when error link is clicked', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Dette feltet er påkrevd', skjemaelementId: 'field1' }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      const errorLink = screen.getByText('Dette feltet er påkrevd')
      fireEvent.click(errorLink)

      const mockElement = document.getElementById('field1')
      expect(mockElement?.focus).toHaveBeenCalled()
      expect(mockElement?.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

      assertNoConsoleIssues(tracker)
    })

    it('dispatches custom event when element is not found', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        nonExistentField: {
          feilmelding: 'Feil på ukjent felt',
          skjemaelementId: 'nonExistentField'
        }
      }

      const eventListener = jest.fn()
      document.addEventListener('feillenke', eventListener)

      render(<ValidationBox {...defaultProps} validation={validation} />)

      const errorLink = screen.getByText('Feil på ukjent felt')
      fireEvent.click(errorLink)

      expect(eventListener).toHaveBeenCalled()
      expect(eventListener.mock.calls[0][0].detail).toEqual({
        feilmelding: 'Feil på ukjent felt',
        skjemaelementId: 'nonExistentField',
        index: 0
      })

      document.removeEventListener('feillenke', eventListener)

      assertNoConsoleIssues(tracker)
    })

    it('uses custom event name when provided', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        nonExistentField: {
          feilmelding: 'Valideringsfeil',
          skjemaelementId: 'nonExistentField'
        }
      }

      const customEventListener = jest.fn()
      document.addEventListener('customEventName', customEventListener)

      render(
        <ValidationBox
          validation={validation}
          heading="Feil"
          eventName="customEventName"
        />
      )

      const errorLink = screen.getByText('Valideringsfeil')
      fireEvent.click(errorLink)

      expect(customEventListener).toHaveBeenCalled()

      document.removeEventListener('customEventName', customEventListener)

      assertNoConsoleIssues(tracker)
    })
  })

  describe('edge cases', () => {
    it('handles validation without skjemaelementId', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Generell feil', skjemaelementId: '' }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      // Should render as BodyLong instead of ErrorSummary.Item
      expect(screen.getByText('Generell feil')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('handles mixed validation with and without skjemaelementId', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: 'Feil med ID', skjemaelementId: 'field1' },
        field2: { feilmelding: 'Feil uten ID', skjemaelementId: '' }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      expect(screen.getByText('Feil med ID')).toBeInTheDocument()
      expect(screen.getByText('Feil uten ID')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('handles empty string feilmelding', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {
        field1: { feilmelding: '', skjemaelementId: 'field1' }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      // Empty message should still render the error summary
      expect(screen.getByTestId('validationBox')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('renders correctly with large number of errors', () => {
      const tracker = trackConsoleIssues()
      const validation: Validation = {}

      // Create 20 validation errors
      for (let i = 1; i <= 20; i++) {
        validation[`field${i}`] = {
          feilmelding: `Feil nummer ${i}`,
          skjemaelementId: `field${i}`
        }
      }

      render(<ValidationBox {...defaultProps} validation={validation} />)

      expect(screen.getByText('Feil nummer 1')).toBeInTheDocument()
      expect(screen.getByText('Feil nummer 10')).toBeInTheDocument()
      expect(screen.getByText('Feil nummer 20')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })
  })

  describe('state transitions', () => {
    it('transitions from no errors to errors without console issues', () => {
      const tracker = trackConsoleIssues()
      const { rerender } = render(<ValidationBox {...defaultProps} validation={{}} />)

      expect(screen.queryByTestId('validationBox')).not.toBeInTheDocument()

      const validationWithErrors: Validation = {
        field1: { feilmelding: 'Ny feil', skjemaelementId: 'field1' }
      }

      rerender(<ValidationBox {...defaultProps} validation={validationWithErrors} />)

      expect(screen.getByTestId('validationBox')).toBeInTheDocument()
      expect(screen.getByText('Ny feil')).toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })

    it('transitions from errors to no errors without console issues', () => {
      const tracker = trackConsoleIssues()
      const validationWithErrors: Validation = {
        field1: { feilmelding: 'Feil', skjemaelementId: 'field1' }
      }

      const { rerender, container } = render(
        <ValidationBox {...defaultProps} validation={validationWithErrors} />
      )

      expect(screen.getByTestId('validationBox')).toBeInTheDocument()

      rerender(<ValidationBox {...defaultProps} validation={{}} />)

      expect(container.firstChild).toBeNull()

      assertNoConsoleIssues(tracker)
    })

    it('updates error messages without console issues', () => {
      const tracker = trackConsoleIssues()
      const validation1: Validation = {
        field1: { feilmelding: 'Første feilmelding', skjemaelementId: 'field1' }
      }

      const { rerender } = render(<ValidationBox {...defaultProps} validation={validation1} />)

      expect(screen.getByText('Første feilmelding')).toBeInTheDocument()

      const validation2: Validation = {
        field1: { feilmelding: 'Oppdatert feilmelding', skjemaelementId: 'field1' }
      }

      rerender(<ValidationBox {...defaultProps} validation={validation2} />)

      expect(screen.getByText('Oppdatert feilmelding')).toBeInTheDocument()
      expect(screen.queryByText('Første feilmelding')).not.toBeInTheDocument()

      assertNoConsoleIssues(tracker)
    })
  })
})

