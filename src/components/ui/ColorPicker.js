import React from 'react';
import PT from 'prop-types';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';

class ColorPicker extends React.Component {

  state = {
      displayColorPicker: false,
      color: {
          r : 255,
          g : 255,
          b : 255,
          a : 1
      }
  };

  static getDerivedStateFromProps(props) {

      return {
          color : props.color
      };
  }

  handleClick () {

      this.setState({
          displayColorPicker: !this.state.displayColorPicker
      });
  }

  handleClose () {

      this.setState({
          displayColorPicker: false
      });
  }

  handleChange (color) {

      this.setState({
          color: color
      });
  }

  render () {

      const { color, onChangeComplete } = this.props;

      const styles = reactCSS({
          'default': {
              color: {
                  width: '36px',
                  height: '14px',
                  borderRadius: '2px',
                  background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
              },
              swatch: {
                  padding: '5px',
                  background: '#fff',
                  borderRadius: '1px',
                  boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                  display: 'inline-block',
                  cursor: 'pointer',
              },
              popover: {
                  position: 'sticky',
                  zIndex: '2',
              },
              cover: {
                  position: 'fixed',
                  top: '0px',
                  right: '0px',
                  bottom: '0px',
                  left: '0px',
              },
          },
      });

      return  <div>
          <div style={ styles.swatch } onClick={ this.handleClick.bind(this) }>
              <div style={ styles.color } />
          </div>
          { this.state.displayColorPicker ? <div style={ styles.popover }>
              <div style={ styles.cover } onClick={ this.handleClose.bind(this) }/>
              <SketchPicker color={ color } onChange={ this.handleChange.bind(this) } onChangeComplete={ onChangeComplete }/>
          </div> : null }

      </div>
  }
}

ColorPicker.propTypes = {
    color            : PT.object,
    onChangeComplete : PT.func
};

export default ColorPicker
