/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @constructor
 * @extends {WebInspector.VBox}
 * @implements {WebInspector.TargetManager.Observer}
 * @param {!WebInspector.ProfilesPanel} profilesPanel
 */
WebInspector.ProfileLauncherView = function(profilesPanel)
{
    WebInspector.VBox.call(this);

    this._panel = profilesPanel;

    this.element.classList.add("profile-launcher-view");
    this.element.classList.add("panel-enabler-view");

    this._contentElement = this.element.createChild("div", "profile-launcher-view-content");
    this._innerContentElement = this._contentElement.createChild("div");
    var targetSpan = this._contentElement.createChild("span");
    var selectTargetText = targetSpan.createChild("span");
    selectTargetText.textContent = WebInspector.UIString("Target:");
    var targetsSelect = targetSpan.createChild("select", "chrome-select");
    new WebInspector.TargetsComboBoxController(targetsSelect, targetSpan);
    this._controlButton = this._contentElement.createChild("button", "ui-btn primary control-profiling");
    this._controlButton.addEventListener("click", this._controlButtonClicked.bind(this), false);
    this._recordButtonEnabled = true;
    this._loadButton = this._contentElement.createChild("button", "ui-btn primary load-profile");
    this._loadButton.textContent = WebInspector.UIString("Load");
    this._loadButton.addEventListener("click", this._loadButtonClicked.bind(this), false);

    //begin strongloop
    this.slInit();
    //end strongloop

    WebInspector.targetManager.observeTargets(this);
}

WebInspector.ProfileLauncherView.prototype = {
    //begin strongloop
    _SL: window.parent.SL.parent,

    slInit: function(){
        window.onload = function(e){
            this._profilerId = this._SL.profiler.getProfilerId();

            if ( this._profilerId === 'file' ) {
                this._hideCpuButtons();
            } else {
                this._toggleFetchButtons();
                this._showFetchButtons();
            }
        }.bind(this);

        //dyanmically update the object from parent window object
        document.documentElement.addEventListener('slInit', function(e){
            //console.log('hooray!', e);
            this._profilerId = this._SL.profiler.getProfilerId();

            this._toggleFetchButtons();
            this._panel._showLauncherView();

            if ( this._profilerId === 'remote' ) {
                this._showFetchButtons();
                this._setTitle('Profile types supported')
            } else {
                this._hideCpuButtons();
                this._setTitle('Profile types supported')
            }
        }.bind(this));

        document.documentElement.addEventListener('setActiveProcess', function(e){
            var data = e.detail;
            var process = data.process;
            var profilerRunning = false;

            var text = process.map(function(p) {
              if (p.isProfiling) {
                profilerRunning = true;
              }

              return p.pid;
            }).join(', ');

            if (!this._isInstantProfile) {
              if (profilerRunning) {
                  this._toggleCpuButtons('stop');
                  this._disableProfilerRadioButtons();
              } else {
                  this._toggleCpuButtons('start');
                  this._enableProfilerRadioButtons();
              }
            } else {
              if (!profilerRunning) {
                this._enableProfilerRadioButtons();
              }
            }

            this._setTitlePid(text);
        }.bind(this));

        document.documentElement.addEventListener('setServer', function(e){
            var data = e.detail;
            var server = data.server;
            var showPort = server.port !== '----';

            var title = ( 'Create a profile for <span class="server">' +
                server.host + ( showPort ? ':' + server.port : '') +
                '</span>, process ID#<span class="pid"></span>' );

            this._setTitle(title);
        }.bind(this));

        document.documentElement.addEventListener('loadFile', function(e) {
            var file = e.detail.file;

            if (file) {
                this._panel._loadFromFile(file);
            }
        }.bind(this));

        document.documentElement.addEventListener('showProfile', function(e) {
          var profile = e.detail.profile;
          var nameParts = profile.split('.');
          var ext = nameParts.pop();
          var name = nameParts.join('.');

          if (profile) {
              var type = this._panel._findProfileTypeByExtension(profile);
              var profile = null;

              type._profiles.forEach(function(d) {
                if (d.title === name) {
                  profile = d;
                  return false;
                }
              });

              if (profile) {
                this._panel.showProfile(profile);
              }
          }
        }.bind(this));

        this._addFetchButtons();
        this._toggleFetchButtons();
    },

    _setTitle: function(html){
        var el = this._contentElement.querySelector('div:first-child h1');

        el.innerHTML = html;
    },

    _setTitlePid: function(text){
        var el = this._contentElement.querySelector('div:first-child h1 .pid');

        el.innerText = text;
    },

    _hideCpuButtons: function(){
        this._fetchHeapButton.style.display = 'none';
//        this._fetchCpuButton.style.display = 'none';
        this._startCpuButton.style.display = 'none';

        //show load button
        this._loadButton.style.display = '';
    },

    _showFetchButtons: function(){
        if ( this._isInstantProfile ) {
            this._fetchHeapButton.style.display = '';
            this._fetchCpuButton.style.display = 'none';
        } else {
            this._fetchHeapButton.style.display = 'none';

            //cpu profiling
            this._startCpuButton.style.display = '';
            this._fetchCpuButton.style.display = 'none';
        }

        //hide load button
        this._loadButton.style.display = 'none';
    },

    _addFetchButtons: function(){
        this._fetchHeapButton = this._contentElement.createChildBefore('button', 'ui-btn primary fetch-heap', this._contentElement.querySelector('.load-profile'));
        this._fetchHeapButton.textContent = WebInspector.UIString('Take Snapshot');
        this._fetchHeapButton.addEventListener('click', this._fetchHeapButtonClicked.bind(this), false);

        this._startCpuButton = this._contentElement.createChildBefore('button', 'ui-btn primary start-cpu', this._contentElement.querySelector('.load-profile'));
        this._startCpuButton.textContent = WebInspector.UIString('Start');
        this._startCpuButton.addEventListener('click', this._startCpuButtonClicked.bind(this), false);

        this._fetchCpuButton = this._contentElement.createChildBefore('button', 'ui-btn primary fetch-cpu', this._contentElement.querySelector('.load-profile'));
        this._fetchCpuButton.textContent = WebInspector.UIString('Stop');
        this._fetchCpuButton.addEventListener('click', this._fetchCpuButtonClicked.bind(this), false);
    },
    //end strongloop
    /**
     * @param {!WebInspector.Target} target
     */
    targetAdded: function(target)
    {
        this._updateLoadButtonLayout();
    },

    /**
     * @param {!WebInspector.Target} target
     */
    targetRemoved: function(target)
    {
        this._updateLoadButtonLayout();
    },

    _updateLoadButtonLayout: function()
    {
        this._loadButton.classList.toggle("multi-target", WebInspector.targetManager.targets().length > 1);
    },

    /**
     * @param {!WebInspector.ProfileType} profileType
     */
    addProfileType: function(profileType)
    {
        var descriptionElement = this._innerContentElement.createChild("h1");
        descriptionElement.textContent = profileType.description;
        var decorationElement = profileType.decorationElement();
        if (decorationElement)
            this._innerContentElement.appendChild(decorationElement);
        this._isInstantProfile = profileType.isInstantProfile();
        this._isEnabled = profileType.isEnabled();
        this._profileTypeId = profileType.id;
    },

    _controlButtonClicked: function()
    {
        this._panel.toggleRecordButton();
    },

    _loadButtonClicked: function()
    {
        this._panel.showLoadFromFileDialog();
    },

    //begin strongloop
    _fetchHeapButtonClicked: function(){
        var SL = this._SL;
        var process = SL.profiler.getActiveProcess();
        //console.log('fetched process', process);

        if ( !process ) return false;

        this._disableProfilerRadioButtons();

        SL.profiler.fetchHeapFile(function(file){
            if ( !file ) {
                this._enableProfilerRadioButtons();
                return;
            }

            //console.log('[iframe] fetched file', file);

            this._panel._loadFromFile(file);
            this._enableProfilerRadioButtons();
        }.bind(this));
    },

    _startCpuButtonClicked: function(){
        var SL = this._SL;
        var process = SL.profiler.getActiveProcess();
        //console.log('start cpu on process', process);

        if ( !process ) return false;

        SL.profiler.startCpuProfiling(function(data){
            if ( !data ) return;

            //console.log('[iframe] start cpu profiling', data);

//            if ( data.status === 200 ) {
                this._toggleCpuButtons('stop');
                this._disableProfilerRadioButtons();
//            }
        }.bind(this));
    },

    //stop profiling button clicked
    _fetchCpuButtonClicked: function(){
        var SL = this._SL;
        var process = SL.profiler.getActiveProcess();
        //console.log('fetched process', process);

        if ( !process ) return false;

        SL.profiler.fetchCpuFile(function(files) {
            var profilePanel = this._panel;

            if ( !files ) return;

            // we don't need to pull the file down right away,
            //console.log('[iframe] fetched cpu file', file);
            //files.forEach(function(file) {
            //  profilePanel._loadFromFile(file);
            //});

            this._enableProfilerRadioButtons();
            this._toggleCpuButtons('start');
        }.bind(this));
    },
    //end strongloop

    _updateControls: function()
    {
        if (this._isEnabled && this._recordButtonEnabled)
            this._controlButton.removeAttribute("disabled");
        else
            this._controlButton.setAttribute("disabled", "");
        this._controlButton.title = this._recordButtonEnabled ? "" : WebInspector.anotherProfilerActiveLabel();
        if (this._isInstantProfile) {
            this._controlButton.classList.remove("running");
            this._controlButton.textContent = WebInspector.UIString("Take Snapshot");
        } else if (this._isProfiling) {
            this._controlButton.classList.add("running");
            this._controlButton.textContent = WebInspector.UIString("Stop");
        } else {
            this._controlButton.classList.remove("running");
            this._controlButton.textContent = WebInspector.UIString("Start");
        }
    },

    profileStarted: function()
    {
        this._isProfiling = true;
        this._updateControls();
    },

    profileFinished: function()
    {
        this._isProfiling = false;
        this._updateControls();
    },

    /**
     * @param {!WebInspector.ProfileType} profileType
     * @param {boolean} recordButtonEnabled
     */
    updateProfileType: function(profileType, recordButtonEnabled)
    {
        this._isInstantProfile = profileType.isInstantProfile();
        this._recordButtonEnabled = recordButtonEnabled;
        this._isEnabled = profileType.isEnabled();
        this._profileTypeId = profileType.id;
        this._updateControls();
    },

    __proto__: WebInspector.VBox.prototype
}


/**
 * @constructor
 * @extends {WebInspector.ProfileLauncherView}
 * @param {!WebInspector.ProfilesPanel} profilesPanel
 */
WebInspector.MultiProfileLauncherView = function(profilesPanel)
{
    WebInspector.ProfileLauncherView.call(this, profilesPanel);

    WebInspector.settings.selectedProfileType = WebInspector.settings.createSetting("selectedProfileType", "CPU");

    var header = this._innerContentElement.createChild("h1");
    header.textContent = WebInspector.UIString("Profile types supported");

    this._profileTypeSelectorForm = this._innerContentElement.createChild("form");

    this._innerContentElement.createChild("div", "flexible-space");

    this._typeIdToOptionElement = {};
}

WebInspector.MultiProfileLauncherView.EventTypes = {
    ProfileTypeSelected: "profile-type-selected"
}

WebInspector.MultiProfileLauncherView.prototype = {
    /**
     * @override
     * @param {!WebInspector.ProfileType} profileType
     */
    addProfileType: function(profileType)
    {
        var labelElement = this._profileTypeSelectorForm.createChild("label");
        labelElement.textContent = profileType.name;
        var optionElement = document.createElement("input");
        labelElement.insertBefore(optionElement, labelElement.firstChild);
        this._typeIdToOptionElement[profileType.id] = optionElement;
        optionElement._profileType = profileType;
        optionElement.type = "radio";
        optionElement.name = "profile-type";
        optionElement.style.hidden = true;
        optionElement.addEventListener("change", this._profileTypeChanged.bind(this, profileType), false);
        var descriptionElement = labelElement.createChild("p");
        descriptionElement.textContent = profileType.description;
        var decorationElement = profileType.decorationElement();
        if (decorationElement)
            labelElement.appendChild(decorationElement);

//        /** STRONGLOOP-BEGIN **/
//        //keeping here for now in case we revert back to icons
//        //add bullet icon to labels
//        var iconElement = labelElement.createChild('i');
//        iconElement.className = 'sl-icon sl-icon-logo';
//        labelElement.insertBefore(iconElement, optionElement);
//        /** STRONGLOOP-END **/
    },

    restoreSelectedProfileType: function()
    {
        var typeId = WebInspector.settings.selectedProfileType.get();
        if (!(typeId in this._typeIdToOptionElement))
            typeId = Object.keys(this._typeIdToOptionElement)[0];
        this._typeIdToOptionElement[typeId].checked = true;
        var type = this._typeIdToOptionElement[typeId]._profileType;
        this.dispatchEventToListeners(WebInspector.MultiProfileLauncherView.EventTypes.ProfileTypeSelected, type);
    },

    _controlButtonClicked: function()
    {
        this._panel.toggleRecordButton();
    },

    _updateControls: function()
    {
        WebInspector.ProfileLauncherView.prototype._updateControls.call(this);
        var items = this._profileTypeSelectorForm.elements;
        for (var i = 0; i < items.length; ++i) {
            if (items[i].type === "radio")
                items[i].disabled = this._isProfiling;
        }
    },

    //being strongloop
    _disableProfilerRadioButtons: function(){
        var items = this._profileTypeSelectorForm.elements;

        for (var i = 0; i < items.length; ++i) {
            if (items[i].type === "radio")
                items[i].disabled = true;
        }
    },

    _enableProfilerRadioButtons: function(){
        var items = this._profileTypeSelectorForm.elements;

        for (var i = 0; i < items.length; ++i) {
            if (items[i].type === "radio")
                items[i].disabled = false;
        }
    },

    _toggleCpuButtons: function(type){
        if ( type == 'stop' ) {
            this._fetchCpuButton.style.display = '';
            this._startCpuButton.style.display = 'none';
        } else {
            this._fetchCpuButton.style.display = 'none';
            this._startCpuButton.style.display = '';
        }
    },

    _toggleFetchButtons: function(){
        if ( this._profilerId === 'file' ) {
            return this._hideCpuButtons();
        }

        if ( this._isInstantProfile ) {
            //heap snapshot
            this._fetchCpuButton.style.display = 'none';
            this._startCpuButton.style.display = 'none';
            this._fetchHeapButton.style.display = '';
        } else {
            //cpu profiling
            this._startCpuButton.style.display = '';
            this._fetchCpuButton.style.display = 'none'; //stop button is hidden at start
            this._fetchHeapButton.style.display = 'none';
        }
    },
    //end strongloop

    /**
     * @param {!WebInspector.ProfileType} profileType
     */
    _profileTypeChanged: function(profileType)
    {
        this.dispatchEventToListeners(WebInspector.MultiProfileLauncherView.EventTypes.ProfileTypeSelected, profileType);
        this._isInstantProfile = profileType.isInstantProfile();
        this._isEnabled = profileType.isEnabled();
        this._profileTypeId = profileType.id;

        //begin strongloop
        this._toggleFetchButtons();
        //end strongloop

        this._updateControls();
        WebInspector.settings.selectedProfileType.set(profileType.id);
    },

    profileStarted: function()
    {
        this._isProfiling = true;
        this._updateControls();
    },

    profileFinished: function()
    {
        this._isProfiling = false;
        this._updateControls();
    },

    __proto__: WebInspector.ProfileLauncherView.prototype
}
