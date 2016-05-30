import THREE from 'three';

/**
 * WavesGeometry class
 */
class WavesGeometry extends THREE.PlaneGeometry {

  /**
   * Constructor function
   */
  constructor() {
    super( 5000, 2000, 20, 20 );
  }
}

export default WavesGeometry;