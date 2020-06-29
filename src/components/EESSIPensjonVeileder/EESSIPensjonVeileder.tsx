import React from 'react'
import classNames from 'classnames'
import PT from 'prop-types'
import SmilendeOrangeVeileder from './veileder/navPensjonSmilendeOrangeVeileder.png'
import TristOrangeVeileder from './veileder/navPensjonTristOrangeVeileder.png'

export type Mood = 'smilende' |'trist'

export interface EESSIPensjonVeilederProps {
  id ?: string;
  className ?: string;
  mood?: Mood
}
const EESSIPensjonVeileder: React.FC<EESSIPensjonVeilederProps> = ({
  className, id, mood = 'smilende'
}: EESSIPensjonVeilederProps): JSX.Element => (
  <div
    id={id}
    className={classNames('c-EESSIPensjonVeileder', className)}
  >
    <img
      width={130}
      alt={'nav-' + mood + '-veileder'}
      height={130}
      src={mood === 'trist' ? TristOrangeVeileder : SmilendeOrangeVeileder}
    />
  </div>
)

EESSIPensjonVeileder.propTypes = {
  className: PT.string,
  mood: PT.oneOf(['smilende', 'trist'])
}
EESSIPensjonVeileder.displayName = 'EESSIPensjonVeileder'
export default EESSIPensjonVeileder
