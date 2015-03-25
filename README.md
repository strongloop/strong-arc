# StrongLoop Arc

StrongLoop Arc was formerly known as Studio.

Please see the [official documentation](http://docs.strongloop.com/display/ARC).

For information on using with the StrongLoop Process Manager, see
http://strong-pm.io.

## Install

### Prerequisite: You must have [Node.js](http://nodejs.org) installed.

### Install using `npm` as follows:

```sh
$ npm install -g strongloop
```

## Run

### 1. Create a new LoopBack project by running the following in your terminal:

```sh
$ slc loopback my-loopback-application
```

### 2. In the application root directory, start the Arc using the `slc arc` command.

```sh
$ cd my-loopback-application
$ slc arc
```

### StrongLoop Arc will open in your default browser.

## Developer Guide

This information is for developers contributing to the `strong-arc` project itself.
For information on using Arc to develop APIs and applications, see the [official documentation](http://docs.strongloop.com/display/ARC).

### Releases

Commits to the `production` branch trigger a build and publish to get-studio.strongloop.com.
Previous releases are available at `http://get-studio.strongloop.com/strong-studio-$VERSION.tgz`

#### Updating angular services for loopback-workspace

Angular services are automatically generated via `gulp build` which is called during `npm install`.

```
$ npm install
```
