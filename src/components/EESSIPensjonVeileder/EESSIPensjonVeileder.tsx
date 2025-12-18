import React, {JSX} from 'react'

const SmilendeOrangeVeileder = 'src/components/EESSIPensjonVeileder/veileder/navPensjonSmilendeOrangeVeileder.png'
const TristOrangeVeileder = 'src/components/EESSIPensjonVeileder/veileder/navPensjonTristOrangeVeileder.png'

export type Mood = 'smilende' |'trist'

export interface EESSIPensjonVeilederProps {
  id ?: string
  className ?: string
  mood?: Mood
}

const EESSIPensjonVeileder: React.FC<EESSIPensjonVeilederProps> = ({
  className, id, mood = 'smilende'
}: EESSIPensjonVeilederProps): JSX.Element => (
  <div
    id={id}
    data-testid='c-eessipensjonveileder'
    className={className}
  >
    <img
      width={130}
      alt={'nav-' + mood + '-veileder'}
      height={130}
      src={mood === 'trist' ? TristOrangeVeileder : SmilendeOrangeVeileder}
    />
  </div>
)

EESSIPensjonVeileder.displayName = 'EESSIPensjonVeileder'
export default EESSIPensjonVeileder
