import React, {Component} from 'react'

//Container that allows you to trigger a callback on
//the group of children as a whole when it gains or loses focus
class FocusGroup extends Component {

    constructor (props) {
        super(props)
        this._onBlur = this._onBlur.bind(this)
        this._onFocus = this._onFocus.bind(this)
        this._timeoutID = null
        this.focus = false
      }
    
      _onBlur (event) {
        const { onBlur = function () {} } = this.props
        this._timeoutID = setTimeout(() => {
          this.focus = false
          onBlur()
        }, 0)
      }
      
      _onFocus (event) {
        const { onFocus = function () {} } = this.props
        clearTimeout(this._timeoutID)
        if(!this.focus){
          this.focus = true
          onFocus()
        }
      }

    render(){
        return <div onBlur={this._onBlur} onFocus={this._onFocus}>
            {this.props.children}
        </div>
    }
}

export default FocusGroup