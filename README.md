# StrongLoop Studio

## Install

### 1. You must have [node.js](http://nodejs.org) and the [StrongLoop CLI](http://docs.strongloop.com/display/LB/Getting+Started+with+LoopBack#GettingStartedwithLoopBack-InstallStrongLoopsoftware) installed.

### 2. Install using `npm` by running the following:

```sh
$ npm install -g http://get-studio.strongloop.com/strong-studio.tgz
```

## Run

### 1. Create a new LoopBack project by running the following in your terminal:

```sh
$ slc loopback
```

### 2. In the directory you created the application, start the Studio using the `strong-studio` command.

```sh
$ cd my-loopback-application
$ strong-studio
```

### 3. Open the URL printed by the `strong-studio` command in a Chrome browser.

## Developer Guide

### Releases

Commits to the `production` branch trigger a build and publish to get-studio.storngloop.com.
Previous releases are available at `http://get-studio.strongloop.com/strong-studio-$VERSION.tgz`

#### Updating angular services for loopback-workspace

Angular services are automatically generated during `gulp build`.

```
$ npm update
$ gulp build
```
