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
