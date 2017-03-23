/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Remote Phone Controls component for A-Frame.
 */
AFRAME.registerComponent('remote-phone-controls', {
  dependencies: ['raycaster'],
  schema: {
      target: {
          type: "selector"
      }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {

    // changes raycast direction
    this.data.raycast_rotation =
    {
      x: 0.0,
      y: 0.0,
      z: 0.0
    }

    this.data.remotephonestate =
    {
      orientation: {},
      touching: false
    };

    // stores current and initial phone orientation
    this.data.orientation =
    {
      alpha: 0.0,
      beta: 0.0,
      gamma: 0.0,
      initial_value: null
    }

    this.data.raycast_initialized = false;

    // link target cursor
    var el = this.el;
    var data = this.data;

    if (data.target === null) {
        var cursor = document.querySelector("a-cursor");

        if (cursor === null) {
            console.warn("Please put a-cursor in a document");
            return;
        }

        data.target = cursor;
    }

    var orientation = data.orientation;
    var remotephonestate = data.remotephonestate;

    // orientation listener
    window.addEventListener('deviceorientation', function (evt) {

      remotephonestate.orientation.alpha = evt.alpha;
      remotephonestate.orientation.beta = evt.beta;
      remotephonestate.orientation.gamma = evt.gamma;

		}, true);

    // touch to recenter cursor
    window.addEventListener('touchstart', function (evt) {

      if (orientation.initial_value != null)
      {
        orientation.initial_value =
        {
            alpha: orientation.alpha,
            beta: orientation.beta,
            gamma: orientation.gamma
        };
      }

		}, true);


    // cursor raycaster listener
    el.addEventListener("raycaster-intersection", function(e) {

        var intersection = getNearestIntersection(e.detail.intersections);
        if (!intersection) {return;}

        // a matrix which represents item's movement, rotation and scale on global world
        var mat = intersection.object.matrixWorld;
        // remove parallel movement from the matrix
        mat.setPosition(new THREE.Vector3(0, 0, 0));

        // change local normal into global normal
        var global_normal = intersection.face.normal.clone().applyMatrix4(mat).normalize();

        // look at target coordinate = intersection coordinate + global normal vector
        var lookAtTarget = new THREE.Vector3().addVectors(intersection.point, global_normal);
        data.target.object3D.lookAt(lookAtTarget);

        // cursor coordinate = intersection coordinate + normal vector * 0.05(hover 5cm above intersection point)
        var cursorPosition = new THREE.Vector3().addVectors(intersection.point, global_normal.multiplyScalar(0.05));
        data.target.setAttribute("position", cursorPosition);

        function getNearestIntersection(intersections) {
            for (var i = 0, l = intersections.length; i < l; i++) {

                // ignore cursor itself to avoid flicker && ignore "ignore-ray" class
                if (data.target === intersections[i].object.el || intersections[i].object.el.classList.contains("ignore-ray")) {continue;}
                return intersections[i];
            }
            return null;
        }
    });
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

  updateOrientation: function () {
    var remotephonestate = this.getRemotePhoneState();
    var data = this.data;
    var orientation = data.orientation;

    if (orientation.initial_value == null)
    {

      if (remotephonestate.orientation.alpha != undefined)
      {
          // set initial start rotation
          orientation.initial_value =
          {
            alpha: remotephonestate.orientation.alpha,
            beta: remotephonestate.orientation.beta,
            gamma: remotephonestate.orientation.gamma
          };

          data.raycast_initialized = true;
        }
    }

    if (data.raycast_initialized)
    {

      // store event orientation values
      orientation.alpha =  remotephonestate.orientation.alpha;
      orientation.beta = remotephonestate.orientation.beta;
      orientation.gamma = remotephonestate.orientation.gamma;

    }
  },

  /**
   * Called on each scene tick.
   */
  tick: function (t) {
      var data = this.data;
      var el = this.el;

      // update orientation based on remotephonestate
      this.updateOrientation();

      if (data.raycast_initialized) {

        // rotate raycaster depending on orientation
        var rotation = el.getAttribute('rotation');

        rotation.y = data.orientation.alpha - data.orientation.initial_value.alpha;
        rotation.x = data.orientation.beta - data.orientation.initial_value.beta;

        el.setAttribute('rotation', rotation);

        rotation = el.getAttribute('rotation');
     }
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
  play: function () { },


  getRemotePhoneState: function () {
    if (this.isProxied()) {
      return this.el.sceneEl.components['proxy-controls'].getRemotePhoneState();
    }
    return this.data.remotephonestate;
  },

  isProxied: function () {
    var proxyControls = this.el.sceneEl.components['proxy-controls'];
    return proxyControls && proxyControls.isConnected();
  }

});
