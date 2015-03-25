# strong-arc

strong-arc is the GUI for the StrongLoop Process Manager, strong-pm, and the
LoopBack framework.

For more details, see http://strong-pm.io and http://loopback.io.

The `strong-arc` command is exposed in the [strongloop
CLI](https://github.com/strongloop/strongloop) as the `slc arc` sub-command,
and is not usually used stand-alone.

Arc was formerly known as Studio.

Please see the [official documentation](http://docs.strongloop.com/display/ARC).

For information on using with the StrongLoop Process Manager, see
http://strong-pm.io.

## Install

See [StrongLoop](https://github.com/strongloop/strongloop).

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
