/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Remote Phone Controls component for A-Frame.
 */
AFRAME.registerComponent('remote-phone-controls', {
  schema: {},

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    this.data.orientation =
    {
      alpha: 0.0,
      beta: 0.0,
      gamma: 0.0
    }

    // orientation values
    var orientation = this.data.orientation;

    window.addEventListener('deviceorientation', function (evt) {
        orientation.alpha =  evt.alpha;
        orientation.beta = evt.beta;
        orientation.gamma = evt.gamma;
		}, true);

  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  tick: function (t) {
      var data = this.data;
      console.log(data.orientation);
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { }
});
