### AllHay Datasway Plugin

## Description

DataSway Cloud Dashboard provides a UI for displaying various hay data with an interactive US map to navigate through regions and counties.

- Contributors: Thomas Wheeler, Level Up Developers
- Tags: Dashboard, interactive us map, counties and states
- License: GPLv2 or later

### On `yarn build` :

Add these lines before index in the build asset-manifest.json

    "mapdata.min.js": "/wp-content/plugins/datasway/build/mapdata.min.js",
    "countymap.js": "/wp-content/plugins/datasway/build/countymap.js",
