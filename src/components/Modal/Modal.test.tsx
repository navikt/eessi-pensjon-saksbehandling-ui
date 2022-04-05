import { render } from '@testing-library/react'
import Modal, { ModalProps } from './Modal'

describe('components/Modal', () => {
  let wrapper: any

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

  it('Render: match snapshot', () => {
    const { container } = render(<Modal {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    wrapper = render(<Modal {...initialMockProps} />)
    expect(wrapper.find('[data-testid=\'c-modal--title-id').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalTitle)
    expect(wrapper.find('[data-testid=\'c-modal--text-id').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalText)
    expect(wrapper.find('[data-testid=\'c-modal--button-id-0\']').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalButtons![0].text)
    expect(wrapper.find('[data-testid=\'c-modal--button-id-1\']').hostNodes().render().text()).toEqual(initialMockProps.modal!.modalButtons![1].text)
  })

  it('Handling: buttons are active', () => {
    wrapper = render(<Modal {...initialMockProps} />);
    (initialMockProps.modal!.modalButtons![0].onClick as jest.Mock).mockReset();
    (initialMockProps.modal!.modalButtons![1].onClick as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'c-modal--button-id-0\']').hostNodes().simulate('click')
    expect(initialMockProps.modal!.modalButtons![0].onClick).toHaveBeenCalled()

    wrapper.find('[data-testid=\'c-modal--button-id-1\']').hostNodes().simulate('click')
    expect(initialMockProps.modal!.modalButtons![1].onClick).toHaveBeenCalled()
  })

  it('Handling: close buttons clicked', () => {
    (initialMockProps.onModalClose as jest.Mock).mockReset()
    wrapper = render(<Modal {...initialMockProps} />)
    wrapper.find('[data-testid=\'c-modal--close-button-id').hostNodes().simulate('click')
    expect(initialMockProps.onModalClose).toHaveBeenCalled()
  })
})
