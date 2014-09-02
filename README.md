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

Ensure you have the latest version of loopback-sdk-angular-cli installed on
your machine:

```
npm install loopback-sdk-angular-cli
```

Run the code generator in Studio root directory:

```
lb-ng -u /workspace/api node_modules/loopback-workspace/app.js client/www/scripts/modules/common/workspace.js
```
