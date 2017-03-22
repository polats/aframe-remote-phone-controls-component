## aframe-remote-phone-controls-component

[![Version](http://img.shields.io/npm/v/aframe-remote-phone-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-remote-phone-controls-component)
[![License](http://img.shields.io/npm/l/aframe-remote-phone-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-remote-phone-controls-component)

Use the phone&#39;s orientation as a remote pointer in the scene

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-remote-phone-controls-component/dist/aframe-remote-phone-controls-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity remote-phone-controls="foo: bar"></a-entity>
  </a-scene>
</body>
```

<!-- If component is accepted to the Registry, uncomment this. -->
<!--
Or with [angle](https://npmjs.com/package/angle/), you can install the proper
version of the component straight into your HTML file, respective to your
version of A-Frame:

```sh
angle install aframe-remote-phone-controls-component
```
-->

#### npm

Install via npm:

```bash
npm install aframe-remote-phone-controls-component
```

Then require and use.

```js
require('aframe');
require('aframe-remote-phone-controls-component');
```
