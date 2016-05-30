import THREE from 'three';
import Gui from './Gui';
import OrbitControls from '../helpers/OrbitControls';
import Window from '../events/Window';
import map from '../../utils/map';

/**
 * Camera class
 */
class Camera extends THREE.PerspectiveCamera {

  /**
   * Constructor function
   */
  constructor( fov, aspect, near, far ) {
    super( fov, aspect, near, far );

    this.controls = new OrbitControls( this, document.getElementById( 'webgl-container' ) );
    this.controls.enableKeys = false;

    this.animated = false;
    this.initialPosition = new THREE.Vector3( 0, 200, 900 );
    this.position.copy( this.initialPosition );
    this.position.range = [ -1500, 1500 ];
    this.diveAmount = {
      value: -900,
      range: [ -1500, this.initialPosition.y ]
    };
    this.speed = {
      value: 1,
      range: [ 0, 3 ]
    };

    Window.add( ::this.resize );

    this.gui();
  }

  /**
   * Update function
   * @param {number} delta Delta
   * @param {number} time  Time
   */
  update( delta, time ) {
    this.controls.update( delta );

    if( this.animated ) {
      this.position.y = map( Math.sin( time * this.speed.value ), -1, 1, this.diveAmount.value, this.initialPosition.y );
    }
  }

  /**
   * gui function
   */
  gui() {

    Gui.panel
      .addGroup({ label: 'Camera', enable: false })
        .addSubGroup({ label: 'General', enable: false })
          .addNumberInput( this, 'fov', { label: 'FOV', dp: 0, onChange: () => this.updateProjectionMatrix() })
          .addCheckbox( this.controls, 'enabled', { label: 'Orbit controls' })
        .addSubGroup({ label: 'Animation', enable: false })
            .addCheckbox( this, 'animated', { label: 'Animated', onChange: () => {
              if( ! this.animated ) {
                this.position.copy( this.initialPosition );
              }
            } })
            .addSlider( this.diveAmount, 'value', 'range', { label: 'Dive amount', dp: 0 })
            .addSlider( this.speed, 'value', 'range', { label: 'Speed', dp: 2 })
        .addSubGroup({ label: 'Position', enable: false })
          .addButton( 'Reset', () => this.resetPosition() )
          .addSlider( this.position, 'x', 'range', { label: 'X', dp: 0 })
          .addSlider( this.position, 'y', 'range', { label: 'Y', dp: 0 })
          .addSlider( this.position, 'z', 'range', { label: 'Z', dp: 0 });
  }

  /**
   * resetPosition function
   */
  resetPosition() {
    this.position.copy( this.initialPosition );
  }

  /**
   * Resize function
   * @param  {integer} width  Width
   * @param  {integer} height Height
   * @return {void}
   */
  resize( width, height ) {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  }
}

export default Camera;