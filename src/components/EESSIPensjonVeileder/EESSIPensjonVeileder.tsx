import PT from 'prop-types'

const SmilendeOrangeVeileder = './veileder/navPensjonSmilendeOrangeVeileder.png'
const TristOrangeVeileder = './veileder/navPensjonTristOrangeVeileder.png'

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

EESSIPensjonVeileder.propTypes = {
  id: PT.string,
  className: PT.string,
  mood: PT.oneOf(['smilende', 'trist'])
}

EESSIPensjonVeileder.displayName = 'EESSIPensjonVeileder'
export default EESSIPensjonVeileder
