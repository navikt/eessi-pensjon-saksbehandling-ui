import { screen, render } from '@testing-library/react'
import Modal, { ModalProps } from './Modal'

describe('components/Modal', () => {
  const initialMockProps: ModalProps = {
    open: true,
    modal: {
      modalTitle: 'mockModalTitle',
      modalText: 'mockModalText',
      modalButtons: [{
        main: true,
        text: 'modalMainButtonText',
        onClick: jest.fn()
      }, {
        text: 'modalOtherButtonText',
        onClick: jest.fn()
      }]
    },
    onModalClose: jest.fn()
  }

  it('Render: has proper HTML structure', () => {
    render(<Modal {...initialMockProps} />)
    expect(screen.getByTestId('modal--title-id')).toHaveTextContent(initialMockProps.modal!.modalTitle as string)
    expect(screen.getByTestId('modal--text-id')).toHaveTextContent(initialMockProps.modal!.modalText as string)
    expect(screen.getByTestId('modal--button-id-0')).toHaveTextContent(initialMockProps.modal!.modalButtons![0].text)
    expect(screen.getByTestId('modal--button-id-1')).toHaveTextContent(initialMockProps.modal!.modalButtons![1].text)
  })

  it('Handling: buttons are active', () => {
    (initialMockProps.modal!.modalButtons![0].onClick as jest.Mock).mockReset();
    (initialMockProps.modal!.modalButtons![1].onClick as jest.Mock).mockReset();

    render(<Modal {...initialMockProps} />)
    screen.getByTestId('modal--button-id-0').click()
    expect(initialMockProps.modal!.modalButtons![0].onClick).toHaveBeenCalled()
    screen.getByTestId('modal--button-id-1').click()
    expect(initialMockProps.modal!.modalButtons![1].onClick).toHaveBeenCalled()
  })
})
