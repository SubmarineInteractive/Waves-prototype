import THREE from 'three';
import WavesGeometry from './WavesGeometry';
import WavesMaterial from './WavesMaterial';

/**
 * Waves class
 */
class Waves extends THREE.Mesh {

  /**
   * Constructor function
   */
  constructor() {
    super( new WavesGeometry(), new WavesMaterial() );

    this.rotation.x = Math.PI / 2;
  }

  /**
   * Update function
   * @param {number} time Time
   */
  update( time ) {
    this.material.update( time );
  }
}

export default Waves;