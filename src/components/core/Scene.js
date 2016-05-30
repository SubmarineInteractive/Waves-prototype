import THREE from 'three';
import raf from 'raf-loop';
import Gui from './Gui';
import Debug from './Debug';
import Clock from '../helpers/Clock';
import Waves from '../meshes/Waves';
import PostProcessing from '../postProcessing/PostProcessing';
import map from '../../utils/map';

/**
 * Scene class
 */
class Scene extends THREE.Scene {

  /**
   * Constructor function
   * @param {Renderer} Renderer Renderer instance
   * @param {Camera}   Camera   Camera instance
   */
  constructor( Renderer, Camera ) {
    super();

    this.renderer = Renderer;
    this.camera = Camera;
    this.postProcessing = new PostProcessing( this, this.renderer, this.camera );

    this.clock = new Clock();

    this.createScene();
    this.gui();
  }

  /**
   * CreateScene function
   */
  createScene() {

    // Debug
    this.debug = new Debug();
    this.add( this.debug );

    // Point light
    this.pointLight = new THREE.PointLight( 0xe7e3e3, 1.7, 1500 );
    this.pointLight.initialPosition = new THREE.Vector3( 0, 400, 950 );
    this.pointLight.position.copy( this.pointLight.initialPosition );
    this.pointLight.position.range = [ -1500, 1500 ];
    this.pointLight.hexColor = `#${ this.pointLight.color.getHexString() }`;
    this.pointLight.animated = false;
    this.pointLight.animationSpeed = {
      value: 0.8,
      range: [ 0, 2 ]
    };
    this.pointLight.debug = false;
    this.add( this.pointLight );

    // Point light debug
    const sphereSize = 25;
    this.pointLightHelper = new THREE.PointLightHelper( this.pointLight, sphereSize );
    this.pointLightHelper.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, wireframeLinewidth: 2 });
    this.pointLightHelper.visible = false;
    this.add( this.pointLightHelper );

    // Waves
    this.waves = new Waves();
    this.add( this.waves );

    this.raf = raf( ::this.render ).start();
  }

  /**
   * gui function
   */
  gui() {

    Gui.panel
      .addGroup({ label: 'Point light', enable: false })
        .addCheckbox( this.pointLight, 'visible', { label: 'Visible' })
        .addCheckbox( this.pointLight, 'debug', { label: 'Debug', onChange: () => {
          if( this.pointLight.debug ) {
            this.pointLightHelper.visible = true;
          } else {
            this.pointLightHelper.visible = false;
          }
        } })
        .addColor( this.pointLight, 'hexColor', { label: 'Color', colorMode: 'hex', onChange: color => {
          const parsedColor = parseInt( color.substring( 1 ), 16 );
          this.pointLight.color.setHex( parsedColor );
        } })
        .addNumberInput( this.pointLight, 'intensity', { label: 'Intensity' })
        .addSubGroup({ label: 'Animation', enable: false })
          .addCheckbox( this.pointLight, 'animated', { label: 'Animated', onChange: () => {
            if( ! this.pointLight.animated ) {
              this.pointLight.position.copy( this.pointLight.initialPosition );
            }
          } })
          .addSlider( this.pointLight.animationSpeed, 'value', 'range', { label: 'Speed' })
        .addSubGroup({ label: 'Position', enable: false })
          .addSlider( this.pointLight.position, 'x', 'range', { label: 'X', dp: 0 })
          .addSlider( this.pointLight.position, 'y', 'range', { label: 'Y', dp: 0 })
          .addSlider( this.pointLight.position, 'z', 'range', { label: 'Z', dp: 0 });
  }

  /**
   * Render function
   */
  render() {

    this.waves.update( this.clock.time );

    if( this.pointLight.animated ) {
      this.pointLight.position.z = map( Math.sin( this.clock.time * this.pointLight.animationSpeed.value ), -1, 1, - this.pointLight.initialPosition.z, this.pointLight.initialPosition.z );
    }

    this.postProcessing.update();
    this.camera.update( this.clock.delta, this.clock.time );
  };
}

export default Scene;