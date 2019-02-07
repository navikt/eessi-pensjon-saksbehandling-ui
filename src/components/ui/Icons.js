import React, { Component } from 'react'
import PT from 'prop-types'
import canvg from 'canvg'

import * as bookmark from '../../resources/images/line-version-bookmark-article.svg'
import * as home from '../../resources/images/line-version-home-3.svg'
import * as handbag from '../../resources/images/line-version-hand-bag-3.svg'
import * as rankarmy from '../../resources/images/line-version-rank-army-2.svg'
import * as heart from '../../resources/images/line-version-heart-circle.svg'
import * as ecoglobe from '../../resources/images/line-version-eco-globe.svg'
import * as stethoscope from '../../resources/images/line-version-expanded-stethoscope.svg'
import * as birthdaycake from '../../resources/images/line-version-birthday-cake.svg'
import * as helpcircle from '../../resources/images/line-version-help-circle.svg'
import * as piggybank from '../../resources/images/line-version-piggy-bank.svg'
import * as removecircle from '../../resources/images/filled-version-remove-circle.svg'
import * as messagesent from '../../resources/images/line-version-expanded-email-send-3.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

class Icons extends Component {
  constructor () {
    super()
    this.canvas = document.getElementById('canvas')
  }

  generateImage (src) {
    const { kind, type } = this.props

    if (type === 'png') {
      canvg('canvas', src)
      return <img className='logo' src={this.canvas.toDataURL('image/png')} alt={kind} />
    }
    return <img className='logo' src={src} alt={kind} />
  }

  render () {
    const { kind } = this.props

    switch (kind) {
      case 'work' : return <FontAwesomeIcon icon={icons.faBriefcase} {...this.props} />
      case 'home' : return <FontAwesomeIcon icon={icons.faHome} {...this.props} />
      case 'child' : return <FontAwesomeIcon icon={icons.faChild} {...this.props} />
      case 'voluntary' : return <FontAwesomeIcon icon={icons.faHandsHelping} {...this.props} />
      case 'military' : return <FontAwesomeIcon icon={icons.faFighterJet} {...this.props} />
      case 'birth' : return <FontAwesomeIcon icon={icons.faChild} {...this.props} />
      case 'learn' : return <FontAwesomeIcon icon={icons.faSchool} {...this.props} />
      case 'daily' : return <FontAwesomeIcon icon={icons.faMoneyBillWave} {...this.props} />
      case 'sick' : return <FontAwesomeIcon icon={icons.faHSquare} {...this.props} />
      case 'other' : return <FontAwesomeIcon icon={icons.faCalendar} {...this.props} />

      case 'nav-work' : return <div {...this.props}>{this.generateImage(handbag)}</div>
      case 'nav-home' : return <div {...this.props}>{this.generateImage(home)}</div>
      case 'nav-child' : return <div {...this.props}>{this.generateImage(heart)}</div>
      case 'nav-voluntary' : return <div {...this.props}>{this.generateImage(ecoglobe)}</div>
      case 'nav-military' : return <div {...this.props}>{this.generateImage(rankarmy)}</div>
      case 'nav-birth' : return <div {...this.props}>{this.generateImage(birthdaycake)}</div>
      case 'nav-learn' : return <div {...this.props}>{this.generateImage(bookmark)}</div>
      case 'nav-daily' : return <div {...this.props}>{this.generateImage(piggybank)}</div>
      case 'nav-sick' : return <div {...this.props}>{this.generateImage(stethoscope)}</div>
      case 'nav-other' : return <div {...this.props}>{this.generateImage(helpcircle)}</div>
      case 'nav-close' : return <div {...this.props}>{this.generateImage(removecircle)}</div>
      case 'nav-message-sent' : return <div {...this.props}>{this.generateImage(messagesent)}</div>
      case 'document' : return <FontAwesomeIcon icon={icons.faFile} {...this.props} />
      case 'view' : return <FontAwesomeIcon icon={icons.faEye} {...this.props} />
      case 'calendar' : return <FontAwesomeIcon icon={icons.faCalendarCheck} {...this.props} />

      case 'user' : return <FontAwesomeIcon icon={icons.faUser} {...this.props} />
      case 'file' : return <FontAwesomeIcon icon={icons.faFile} {...this.props} />
      case 'print' : return <FontAwesomeIcon icon={icons.faPrint} {...this.props} />
      case 'folder' : return <FontAwesomeIcon icon={icons.faFolderOpen} {...this.props} />
      case 'save' : return <FontAwesomeIcon icon={icons.faSave} {...this.props} />
      case 'export' : return <FontAwesomeIcon icon={icons.faFileExport} {...this.props} />
      case 'file-submit' : return <FontAwesomeIcon icon={icons.faUpload} {...this.props} />
      case 'menu' : return <FontAwesomeIcon icon={icons.faBars} {...this.props} />

      case 'clip' : return <FontAwesomeIcon icon={icons.faPaperclip} {...this.props} />
      case 'refresh' : return <FontAwesomeIcon icon={icons.faSyncAlt} {...this.props} />
      case 'form' : return <FontAwesomeIcon icon={icons.faBars} {...this.props} />
      case 'tool' : return <FontAwesomeIcon icon={icons.faWrench} {...this.props} />
      case 'plus' : return <FontAwesomeIcon icon={icons.faPlus} {...this.props} />
      case 'download' : return <FontAwesomeIcon icon={icons.faDownload} {...this.props} />
      case 'upload' : return <FontAwesomeIcon icon={icons.faUpload} {...this.props} />
      case 'caretLeft' : case 'back' : return <FontAwesomeIcon icon={icons.faCaretLeft} {...this.props} />
      case 'caretRight' : case 'next' : return <FontAwesomeIcon icon={icons.faCaretRight} {...this.props} />
      case 'server' : return <FontAwesomeIcon icon={icons.faServer} {...this.props} />
      case 'db' : return <FontAwesomeIcon icon={icons.faDatabase} {...this.props} />
      case 'close' : return <FontAwesomeIcon icon={icons.faTimesCircle} {...this.props} />
      default: return null
    }
  }
}

Icons.propTypes = {
  kind: PT.string.isRequired
}

export default Icons
