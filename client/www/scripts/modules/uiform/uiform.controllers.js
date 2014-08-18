// Copyright StrongLoop 2014
UIForm.controller('UIFormMainController',[
  '$scope',
  'SampleDataService',
  function($scope, SampleDataService) {

    var sampleForm = {
      fields:[
        {
          fieldName:'firstName',
          fieldType:'text',
          fieldLabel:'First Name',
          required:true
        },
        {
          fieldName:'lastName',
          fieldType:'text',
          fieldLabel:'Last Name'
        },
        {
          fieldName:'email',
          fieldType:'email',
          fieldLabel:'Email',
          required:true
        },
        {
          fieldName:'lastUpdate',
          fieldType:'date',
          fieldLabel:'Last Update'
        },
        {
          fieldName:'developerType',
          fieldType:'select',
          fieldLabel:'Developer Type',
          options: {
            multiSelect:true
          },
          required:true
        }
      ]
    };


    for (var i = 0;i <  sampleForm.fields.length;i++) {
      var fValue = '';
      if (sampleForm.fields[i].fieldType === 'select') {
        var fOptions = SampleDataService.getSampleSelectOptions({
            dataType: sampleForm.fields[i].fieldType,
            fieldName: sampleForm.fields[i].fieldName
          }
        );
        sampleForm.fields[i].fieldOptions = fOptions;
        fValue = SampleDataService.getValueFromOptions(fOptions);

      } else {
        fValue = SampleDataService.getSampleValue({
            dataType: sampleForm.fields[i].fieldType,
            fieldName: sampleForm.fields[i].fieldName
          }
        );
      }
      sampleForm.fields[i].fieldValue = fValue;

    }
    $scope.currUIForm = sampleForm;

    $scope.addUIFormElement = function(inputType) {
      var formFieldDef = {
//          fieldName:'field_name',
          fieldType:inputType,
          fieldLabel:'label'
        };

      if (formFieldDef.fieldType === 'select') {
        var fOptions = SampleDataService.getSampleSelectOptions({
            dataType: formFieldDef.fieldType,
            fieldName: formFieldDef.fieldName
          }
        );
        sampleForm.fields[i].fieldOptions = fOptions;
        fValue = SampleDataService.getValueFromOptions(fOptions);

      } else {
        fValue = SampleDataService.getSampleValue({
            dataType: formFieldDef.fieldType,
            fieldName: formFieldDef.fieldName
          }
        );
      }
      formFieldDef.fieldValue = fValue;


      $scope.currUIForm.fields.push(formFieldDef);
    }
  }
]);
