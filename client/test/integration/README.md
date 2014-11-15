# Integration tests

This folder contains integration tests executing Angular code
and communicating directly with the Arc backend.

## Setting up the environment

 1. The tests need `test-server` running in background:

     ```
     $ node client/test/integration/test-server
     ```

 2. Tests are being executed by karma runner. The default setup is to watch
    the filesystem and rerun the tests whenever a file was changed.

    ```
    $ karma client/test/integration/karma.integration.js
    ```

## Writing the tests

The tests are written using `mocha` and `chai`, all test files are in
the `spec` folder. Test files should have `.ispec.js` extension to distinguish
them from pure unit tests we may add later.

Since Angular is promise-based and Mocha supports promises, you should always
return a promise from an async test.

```js
// correct
it('is async', function() {
  return $http({/*...*/});
});

// incorrect
it('is async', function(done) {
  $http({/*...*/}, function(res) { done(); }, done);
});
```

### Dependency injection

The test environment is configured to provide a `test` module that includes the
main `app` module and any test-specific overrides. Use the provided helper
method `inject(blockFn)` to resolve dependencies. Example:

```js
it('can get a project name', function() {
  return inject(function(PackageDefinition) {
    var pkg = PackageDefinition.findOne();
    return pkg.$promise
      .then(function() {
        expect(pkg.name).to.equal('empty');
      });
  });
});
```

### Reporting HTTP errors

When an HTTP request fails, the promise is resolved with an angular http
response object, which produces a rather unhelpful error message.

Use `throwHttpError` to convert a http response into a descriptive error:

```js
it('fails', function() {
  return inject(function(PackageDefinition, throwHttpError) {
    var pkg = PackageDefinition.findOne({ filter: { name: 'unknown' } })
      .catch(throwHttpError);
  });
});
```

### Test data

Use the global `given` object to access helper methods for building test data.
See [helpers/given.js](helpers/given.js) for details.

