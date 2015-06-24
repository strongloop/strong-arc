describe('modelPropertyTypes', function() {
  var modelPropertyTypes;

  beforeEach(function() {
    return inject(function(_modelPropertyTypes_) {
      modelPropertyTypes = _modelPropertyTypes_;
      return modelPropertyTypes.$promise;
    });
  });

  it('contains all core types', function() {
    expect(modelPropertyTypes).to.include.members([
      'string',
      'array',
      'buffer',
      'date',
      'geopoint',
      'number',
      'boolean',
      'object',
      'any'
    ]);
  });
});
