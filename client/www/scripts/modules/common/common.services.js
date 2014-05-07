// Copyright StrongLoop 2014
Common.service('StringService', [
  'UserPreferenceService',
  function(UserPreferenceService) {
    var svc = {};;

    svc.normalizeString = function(origString) {

      var retVal = origString;
      var normalizationStrategy = 'dasherize';

      if (UserPreferenceService.getUserPref('modelNameNormalizationStrategy')) {
        normalizationStrategy = UserPreferenceService.getUserPref('modelNameNormalizationStrategy');
      }

      switch(normalizationStrategy){
        case 'camelize':
          retVal = window.S(retVal).camelize().s;
          break;
        case 'dasherize':
          retVal = window.S(retVal).dasherize().s;
          break;
        default:
          retVal = window.S(retVal).camelize().s;
      }
      return retVal;

    };
    svc.decodeHTMLEntities = function(origString) {
      return window.S(origString).decodeHTMLEntities().s;
    };
    svc.isOnlyAlpha =  function(origString){
      return window.S(origString).isAlpha();
    };
    svc.escapeHTML = function(origString) {
      return window.S(origString).escapeHTML().s;
    };
    svc.humanize = function(origString) {
      return window.S(origString).humanize().s;
    };
    svc.isAlphaNumeric = function(origString) {
      return window.S(origString).isAlphaNumeric();
    };
    svc.slugify = function(origString) {
      return window.S(origString).slugify().s;
    };
    svc.trim = function(origString) {
      return window.S(origString).trim().s;
    };
    svc.underscore = function(origString) {
      return window.S(origString).underscore().s;
    };
    svc.unescapeHTML = function(origString) {
      return window.S(origString).unescapeHTML().s;
    };
    return svc;
  }
]);
