import ControlKit from 'controlkit';

/**
 * Gui class
 */
class Gui extends ControlKit {

  /**
   * constructor function
   * @param {Object} options Options
   */
  constructor( options ) {
    super( options );

    this.panel = this.addPanel();
  }

  /**
   * addPanel function
   * @param {Object} options Options
   */
  addPanel( options = {}) {
    return super.addPanel({
      align: 'left',
      position: [ 10, 10 ],
      opacity: 0.8,
      width: 275,
      ratio: 10,
      fixed: false,
      ...options
    });
  }
}

export default new Gui;