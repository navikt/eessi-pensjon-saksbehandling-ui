import PT from 'prop-types'

export const WidgetPropType = PT.shape({
  i: PT.string.isRequired,
  type: PT.string.isRequired,
  title: PT.string.isRequired,
  visible: PT.bool.isRequired,
  options: PT.object.isRequired
})

export const WidgetsPropType = PT.arrayOf(WidgetPropType.isRequired)
