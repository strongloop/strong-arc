var IA = {
  root: [
    {
      "name": "PageHeaderContainer",
      "display": "Page Header",
      "children": []
    },
    {
      "name": "MainContentContainer",
      "display": "Main Content",
      "children": [
        {
          "name": "TwoColSidebarLayout",
          "display": "layout: 2 column sidebar",
          "children": [
            {
              "name":"MainSidebarColContainer",
              "display": "main sidebar column container",
              "children": [
                {
                  "name": "MainNavContainer",
                  "display": "Main Nav Container",
                  "children": [
                    {
                      "name": "MainNavSearch",
                      "display": "Main Nav Search",
                      "children": []
                    },
                    {
                      "name": "MainNavTree",
                      "display": "Main Nav Tree",
                      "children": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "HorizontalTabNavContainer",
              "display": "Horizontal Tab Nav Container",
              "children": [
                {
                  "name": "ModelEditTabContainer",
                  "display": "Model Edit Tab Container",
                  "children": []
                },
                {
                  "name": "CanvasViewContainer",
                  "display": "Canvas View Container",
                  "children": [
                    {
                      "name": "ProjectCanvas",
                      "children": []
                    }
                  ]
                },
                {
                  "name": "APIExplorerContainer",
                  "display": "API Explorer Container",
                  "children": [
                    {
                      "name": "APIExplorer",
                      "display": "API Explorer",
                      "children": [
                        {
                          "name": "EndPointList",
                          "display": "End Point List",
                          "children": []
                        },
                        {
                          "name": "EndPointInstance",
                          "display": "End Point Instance",
                          "children": [
                            {
                              "name": "URLPattern",
                              "children": []
                            },
                            {
                              "name": "EndpointAccessControl",
                              "children": []
                            },
                            {
                              "name": "EndPointTest",
                              "children": [
                                {
                                  "name": "APIForm",
                                  "children": []
                                },
                                {
                                  "name": "APIDataGenerator",
                                  "children": []
                                }
                              ]
                            },
                            {
                              "name": "NetworkTrafficMonitor",
                              "display": "Network Traffic Monitor",
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "PageFooterContainer",
      "display": "Page Footer",
      "children": []
    }
  ]
};
