import THREE from 'three';
import Gui from '../../core/Gui';
import shaderParse from '../../../utils/shader-parse';
const glslify = require('glslify');

/**
 * WavesMaterial class
 */
class WavesMaterial extends THREE.ShaderMaterial {

  /**
   * Constructor function
   * @param {Object} options Options
   */
  constructor( options ) {
    super( options );

    this.vertexShader = shaderParse( glslify( './shader/vert.glsl' ) );
    this.fragmentShader = shaderParse( glslify( './shader/frag.glsl' ) );

    this.lights = true;
    this.side = THREE.DoubleSide;

    this.uniforms = THREE.UniformsUtils.merge( [
      THREE.UniformsLib[ 'lights' ],
      THREE.UniformsLib[ 'ambient' ],
      {
        time: { type: 'f', value: 0.0 },
        speed: { type: 'f', value: 0.2, range: [ 0, 2 ] },
        amplitude: { type: 'f', value: 150.0, range: [ 0, 500 ] },
        diffuse: { type: 'c', value: new THREE.Color( 0x243465 ) },
        opacity: { type: 'f', value: 1 }
      }
    ] );

    this.uniforms.diffuse.hexColor = `#${ this.uniforms.diffuse.value.getHexString() }`;

    this.gui();
  }

  /**
   * gui function
   */
  gui() {

    Gui.panel
      .addGroup({ label: 'Waves', enable: false })
        .addSubGroup({ label: 'Material', enable: false })
          .addColor( this.uniforms.diffuse, 'hexColor', { label: 'Diffuse color', colorMode: 'hex', onChange: color => {
            const parsedColor = parseInt( color.substring( 1 ), 16 );
            this.uniforms.diffuse.value.setHex( parsedColor );
          } })
          .addSlider( this.uniforms.speed, 'value', 'range', { label: 'Noise speed', dp: 2 })
          .addSlider( this.uniforms.amplitude, 'value', 'range', { label: 'Noise amplitude', dp: 0 })

  }

  /**
   * Update function
   * @param {number} time Time
   */
  update( time ) {
    this.uniforms.time.value = time;
  }
}

export default WavesMaterial;