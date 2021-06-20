import react, { Component } from 'react';
import { Rnd } from 'react-rnd';
// import './DraggableModal.less';
export default class DraggableModal extends Component {
      constructor(props) {
          super(props);
          this.state = {
              translateX: 0,
              translateY: 0,
          };
          this.moving = false;
          this.lastX = null;
          this.lastY = null;
          window.onmouseup = e => this.onMouseUp(e);
          window.onmousemove = e => this.onMouseMove(e);
      }
  
      onMouseDown(e) {
          e.stopPropagation();
          this.moving = true;
      }
  
      onMouseUp() {
          this.moving = false;
          this.lastX = null;
          this.lastY = null;
      }
  
      onMouseMove(e) {
          this.moving && this.onMove(e);
      }
  
      onMove(e) {
          if(this.lastX && this.lastY) {
              let dx = e.clientX - this.lastX;
              let dy = e.clientY - this.lastY;
              this.setState({ translateX: this.state.translateX + dx, translateY: this.state.translateY + dy })
          }
          this.lastX = e.clientX;
          this.lastY = e.clientY;
      }
  
      render() {
          return (
            <Rnd
                default={{
                  x: 0,
                  y: 0,
                  width: 320,
                  height: 200,
                }}
              >
                {this.props.children}
            </Rnd>
          )
      }
}