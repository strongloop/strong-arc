2016-01-19, Version 1.8.8
=========================

 * republish (Joseph Tary)


2016-01-14, Version 1.8.7
=========================

 * remove project-list (Joseph Tary)


2016-01-14, Version 1.8.6
=========================

 * remove ubuntu fonts from arc (Anthony Ettinger)

 * Remove React dependency from Arc (Joseph Tary)

 * removed react depedency from metrics module (Joseph Tary)

 * Remove unused directives from arc.react.js, and remove from project. (Amrit Bhullar)

 * Add project list support. (Krishna Raman)


2015-12-15, Version 1.8.5
=========================

 * Remove cxviz-pie (Joseph Tary)

 * Fix error when overriding host (Joseph Tary)

 * Add filesystem browsing support. (Krishna Raman)

 * update the react tools away from deprecated version (Joseph Tary)


2015-11-24, Version 1.8.4
=========================

 * Revert "Add user easing for when chart data is insuffient" (Joseph Tary)

 * Change loopback-explorer to loopback-component-explorer (Joseph Tary)

 * add option to override Arc host settings, and display better connection info to user (Joseph Tary)

 * Add user easing for when chart data is insuffient (Joseph Tary)

 * fix property menu when navigating back and forth in composer (Anthony Ettinger)

 * remove old File call (Anthony Ettinger)

 * use Blob instead of File object in profiler (Anthony Ettinger)

 * Refer to licenses with a link (Sam Roberts)

 * Remove reference to internal PM (Joseph Tary)


2015-10-14, Version 1.8.3
=========================

 * Revert "Fix squashed  / overlapping chart containers" (Anthony Ettinger)

 * Fix issues with PID count on PM list (Joseph Tary)

 * Fix delete then set pid count issue in PM view (seanbrookes)

 * fix alignment on button for app popover (Anthony Ettinger)

 * fixup! revert d3 library upgrades (Ryan Graham)

 * add new generated lb-build script (Anthony Ettinger)

 * revert d3 library upgrades (Anthony Ettinger)

 * Ensure latest service instance when polling tracing processes (seanbrookes)

 * Fix target pid count mis-match (seanbrookes)

 * Fix squashed  / overlapping chart containers (seanbrookes)


2015-10-05, Version 1.8.2
=========================

 * Fix broken service resolution (seanbrookes)

 * Fix broken heap snapshot (seanbrookes)

 * Remove double slash from app control link display (seanbrookes)

 * Update loopback-workspace ver for new app controller (seanbrookes)

 * convert links in profile to spans (Anthony Ettinger)

 * pass cluster size to the new deployment API (Ryan Graham)

 * fix reference to renamed WorkspaceServices 3.0 (seanbrookes)

 * fix reference to renamed WorkspaceServices 2.0 (seanbrookes)

 * fix reference to renamed WorkspaceServices (seanbrookes)

 * Use strongloop conventions for licensing (Sam Roberts)

 * remove isolate test notation (seanbrookes)

 * fix jshint line too long (seanbrookes)

 * Replace internal pm with workspace controlls (seanbrookes)

 * update d3 libs (Anthony Ettinger)

 * add missing sdk api references (seanbrookes)

 * replace tracing pm host selector with shared component (Ryan Graham)

 * linting: fix jshint failures that abort the build (Ryan Graham)

 * set the number of x axis ticks to avoid messy auto display (seanbrookes)

 * fix loading delay issue with api analytics (seanbrookes)

 * Fix PID and profiles not updating automatically (Joseph Tary)

 * test: generate coverge for karma tests (Ryan Graham)

 * deps: update ws to 0.8.0 (Ryan Graham)

 * test: fix flaky compoer test (Ryan Graham)

 * fix various html/react errors (Ryan Graham)

 * test: fix e2e composer tests (Ryan Graham)

 * test: re-enable browser sync in protractor (Ryan Graham)

 * test: catch and ignore unlink error (Ryan Graham)


2015-08-18, Version 1.8.1
=========================

 * adjust states to take into acound no-app state (seanbrookes)

 * initialize first host and process across the app modules (seanbrookes)


2015-08-17, Version 1.8.0
=========================

 * remove reset to null on default datasource (seanbrookes)

 * add intercom widget (Anthony Ettinger)

 * remove clipboard dependency in tests (Anthony Ettinger)

 * remove ng-clipboard and zeroclipboard libraries (Anthony Ettinger)

 * Exclude Workspace model from test server reset (Ritchie Martori)

 * Hide app-controller when not supported (Joseph Tary)

 * test: remove assumption about error message (Ryan Graham)

 * deps: pin loopback-workspace to 3.15.x (Ryan Graham)

 * Fix missing ability to select models for property types (Joseph Tary)


2015-07-31, Version 1.7.1
=========================

 * update log message object reference in catch conditions (seanbrookes)

 * Revert "pass cluster size to the new perform deployment API" (Krishna Raman)

 * fix Arc polling on unexpected error state (seanbrookes)

 * Pass cluster size to the new perform deployment API strong-deploy 3.x. (Tetsuo Seto)

 * Update pm-host.spec.js (Matthew Martori)

 * Update pm-host-error-view.spec.js (Matthew Martori)

 * Added basic coverage for process manager (Matttt)

 * add pagination to api-analytics graphs (Anthony Ettinger)


2015-07-24, Version 1.7.0
=========================

 * fix using wrong property status test for host problems (seanbrookes)

 * add axis labels to api-analytics (Anthony Ettinger)

 * fix errant 'off' state for toggle control in the directive (seanbrookes)

 * updates to fix references to incorrect pm host (seanbrookes)

 * Removed arcmanager.json (Matttt)

 * replaced undefined `xdescribe`s and other jshint errors (Matttt)

 * Completed navigation coverage (Matttt)

 * Remove PID selector from API Analytics (Joseph Tary)

 * fix border on action cell in PM (Anthony Ettinger)

 * add dropdown select menu to styleguide (Anthony Ettinger)

 * add change stream to lb-build (seanbrookes)

 * Fixed whitespace, utilized Expected Conditions, and deleted misc file (Matttt)

 * Removed browser.pause() (Matttt)

 * Cleaned up to pass JSHint (Matttt)

 * Completed composer view coverage (Matttt)

 * Add additional e2e composer tests (Matttt)

 * add namespace to tracing rules (Anthony Ettinger)

 * fix select all in composer (Anthony Ettinger)

 * test: get protractor tests working again (Ryan Graham)

 * test: add protractor tests to npm test (Ryan Graham)

 * Re-enable smart profiling (Joseph Tary)

 * consistency updates to how Arc presents strong-pm (seanbrookes)


2015-07-07, Version 1.6.0
=========================

 * Disable the smart profiler option (Joseph Tary)

 * simplify logic for testing for invalid module license (seanbrookes)

 * fix licensing message when not renewable (Anthony Ettinger)

 * fix license validity check for tracing (Anthony Ettinger)

 * remove user info after logout attempt (Anthony Ettinger)

 * Fix heap snapshot flicker (Joseph Tary)

 * add check for duplicate product and feature name (Anthony Ettinger)

 * licenses page using v2 api (Anthony Ettinger)

 * update oracle query path string (seanbrookes)

 * Fix incorrect status for PIDs (Joseph Tary)

 * tactical pm updates (seanbrookes)

 * build-deploy: use exit status for success/fail (Sam Roberts)

 * build-tasks: fix options to writeJsonFile (Sam Roberts)

 * fix broken integration test for property types (Anthony Ettinger)

 * Add delete button for profiles (Joseph Tary)

 * devtools: fix issues in the debugger UI (Miroslav Bajtoš)

 * make host actions menu more usable (seanbrookes)

 * Fix controls being locked after profiling (Joseph Tary)

 * Fix updating the status or PIDs and filter out broken profiles that will never complete. (Joseph Tary)

 * fix button state on trace navigation (seanbrookes)

 * adjust the alignment of the header controls (seanbrookes)

 * align with styleguide (seanbrookes)

 * use global jQuery and d3 in tracing modules (Ryan Graham)

 * remove tracing feature flag (seanbrookes)

 * Fix colour and working in profiler settings summary (Joseph Tary)

 * reset file load order after cleaning up deps (seanbrookes)

 * add favicon.ico to Arc's root static path (Ryan Graham)

 * process-manager: pass --base explicitly (Sam Roberts)

 * add nicer graphic to tracing init view (seanbrookes)

 * revert path to older version of contextMenu (seanbrookes)

 * Revert "Feature/licensing renewal" (Anthony Ettinger)

 * change default icon to use hover icon (Anthony Ettinger)

 * add growl messages for pid updates in tracing (seanbrookes)

 * fix initial timeseries chart rendering regression (seanbrookes)

 * fix control alignment issue (seanbrookes)

 * fix broken injection (seanbrookes)

 * deps: remove dependency on slug (Ryan Graham)

 * Add support to Arc for smart-profiling feature (Joseph Tary)


2015-06-11, Version 1.4.2
=========================

 * fix broken injection (seanbrookes)

 * package: prevent strong-arc from bundling itself (Ryan Graham)

 * deps: remove dependency on slug (Ryan Graham)


2015-06-10, Version 1.4.1
=========================

 * Fix issue with metric charts not displaying properly on load (Joseph Tary)

 * Revert "Add support to Arc for smart-profiling feature" (Joseph Tary)

 * Add support to Arc for smart-profiling feature (Joseph Tary)

 * handle case of brand new pm host with no app (seanbrookes)

 * minor text tweak (seanbrookes)

 * rework logic to test if pids have correct state (seanbrookes)

 * Allow offline model for getProducts() (Raymond Feng)

 * package: add bugs URL (Ryan Graham)

 * package: update license to use SPDX expression (Ryan Graham)

 * Only echo pm output to console during DEBUG mode (Sam Roberts)

 * delete extra mailto: (Setogit)

 * update to test if pm has no license (seanbrookes)

 * add licenses help id (Anthony Ettinger)

 * add api-analytics help id (Anthony Ettinger)

 * add support for non-module help icon (Anthony Ettinger)

 * exclude local app from PMServers service call (Anthony Ettinger)

 * fix dropdown menu in navbar (Anthony Ettinger)

 * include bower libraries in strong-arc package (Anthony Ettinger)

 * add `del` as dependency (Anthony Ettinger)

 * clean vendor directory before running build and bower install (Anthony Ettinger)

 * bower dependencies (Anthony Ettinger)


2015-06-03, Version 1.4.0
=========================

 * fix missing scroll on inspector view take2 (seanbrookes)

 * add user input to typeahead on pm host form (Anthony Ettinger)

 * fix missing scroll on inspector view (seanbrookes)

 * use the right id to get a name of costItem (Setogit)

 * remove redundant directive declaration (seanbrookes)

 * revert chart label change (seanbrookes)

 * update the chart label (seanbrookes)

 * add extra $timeout to un-bind the rendering from the get request (seanbrookes)

 * wire up loading indicator to trace sequences (seanbrookes)

 * add filter to pm services to filter on worker id != 0 (seanbrookes)

 * make toggle switch only visible when it is safe (seanbrookes)

 * add feature flag back - tracing (seanbrookes)

 * final ux tweaks prior to release (seanbrookes)

 * fix broken dropdown (seanbrookes)

 * tracing ticker (seanbrookes)

 * implement styleguide toggle switch (seanbrookes)

 * initial toggle button troubleshooting (seanbrookes)

 * temporary Angular rollback for metrics fix (seanbrookes)

 * tracing view initialization cleanup (seanbrookes)

 * tweak to trigger build (seanbrookes)

 * add api-analytics feature flag (seanbrookes)

 * add new case to codified messages coming from host manager (seanbrookes)

 * remove tracing feature flag (seanbrookes)

 * fix scope problem betweem diff pm host selector versions (seanbrookes)

 * update app controller icon (Anthony Ettinger)

 * comment out code to save requests for trace history (seanbrookes)

 * add logic to show correct state of timline buttons (seanbrookes)

 * fix the ng-show logic (Setogit)

 * complete fix for stale pids on tracing stop/start (seanbrookes)

 * add feature flag to show/hide untagged waterfalls (seanbrookes)

 * add new menu icon to navbar (Anthony Ettinger)

 * resize chart dynamically based on dataset size (Anthony Ettinger)

 * change the drawing order of orange and blue lines (Setogit)

 * fix js exception causing render halt (seanbrookes)

 * rework waterfall navigation - mapped traces (seanbrookes)

 * remove reference to trace history directive (seanbrookes)

 * initial UX streamline: remove pie charts (seanbrookes)

 * filter dead pids in tracing pid selector (seanbrookes)

 * initial tracing on/off function (seanbrookes)

 * add license check to analytics (Anthony Ettinger)

 * ui control to toggle tracing on/off (seanbrookes)

 * remove page heading from analytics (Anthony Ettinger)

 * fix wrong var name (seanbrookes)

 * fix missing inspector values (seanbrookes)

 * add format wrapper to target values as per original (seanbrookes)

 * revert bad readme reference (Anthony Ettinger)

 * sort chart 2 (Anthony Ettinger)

 * ui fixup on licenses page (Anthony Ettinger)

 * Tracing main feature merge (seanbrookes)

 * fix bad object in licenses page (Anthony Ettinger)

 * add api analytics icon to landing page (Anthony Ettinger)

 * add clientDetail to popover on endpoint chart (Anthony Ettinger)

 * Add popover-dialog component to styleguide (Joseph Tary)

 * move advisor behind feature flag (Ryan Graham)

 * set feature flags earlier in boot (Ryan Graham)

 * api analytics charts (Anthony Ettinger)


2015-05-13, Version 1.3.0
=========================

 * fix oracle and memcached metrics names (Setogit)

 * add feature flag support (Ryan Graham)

 * use minimist for CLI argument parsing (Ryan Graham)

 * move metrics out of beta (seanbrookes)

 * remove redundant functions (seanbrookes)

 * missed mongodb (seanbrookes)

 * add missing metrics probes (seanbrookes)


2015-05-08, Version 1.2.1
=========================

 * Regenerate bundles (Ryan Graham)

 * Fix setting env variables against multi-app pm (Joseph Tary)


2015-05-05, Version 1.2.0
=========================

 * updates to align metrics license check (seanbrookes)

 * Fix showing all pids on PM (Joseph Tary)

 * more explicit if/else license logic (seanbrookes)

 * remove redundant code (seanbrookes)

 * add license notification to metrics module (seanbrookes)

 * Remove the Arc app-controller port override. (Joseph Tary)

 * add global messaging to styleguide (Anthony Ettinger)

 * hide empty metrics charts (Joseph Tary)

 * Fix PM help button showing blank dialog (Joseph Tary)

 * Don't show app version if it can't be determined (Joseph Tary)

 * Fixup Arc dropdown menus (Joseph Tary)

 * fix persisting strict on model definition (seanbrookes)

 * Adjust padding for tables (Joseph Tary)

 * Fixes for metrics UX (Joseph Tary)

 * Add modal dialog component to live styleguide (Joseph Tary)

 * update start attempt count (seanbrookes)

 * add license key to licenses page (Anthony Ettinger)

 * Remove sidebar from metrics (Joseph Tary)

 * fix bad login redirect (Anthony Ettinger)

 * fix --licenses redirect (Anthony Ettinger)

 * Improve metrics background stability (Joseph Tary)

 * adjust color and icon size on error help popover (Anthony Ettinger)

 * Add UI to process manager to allow for editing environment variables (Joseph Tary)

 * revert license push api call (Anthony Ettinger)

 * Make the add host button larger and update the colors (Joseph Tary)

 * Fix checkbox alignment (Joseph Tary)

 * Fix indent on PID selector labels (Joseph Tary)

 * Retrofit table buttons with new style (Joseph Tary)

 * Add accessory button type (Joseph Tary)

 * add help icon redesign to styleguide (Anthony Ettinger)

 * add license push to action item menu on process manager (Anthony Ettinger)

 * make help icon red for errors (Anthony Ettinger)

 * fix broken autosuggest on PM (Anthony Ettinger)

 * add basic license renewal against api (Anthony Ettinger)

 * Various retrofits to improve compliance with styleguide (Joseph Tary)

 * readme: add reference to strong-pm.io (Sam Roberts)

 * Retrofit tabs on composer (Joseph Tary)

 * fix/improve arc run behaviour with slc start (Joseph Tary)

 * Fix the loading from local key store (Raymond Feng)

 * Copy properties from received errors (Raymond Feng)

 * Add products to licenses.json and improve error handling (Raymond Feng)

 * 1050-fix don't update the metrics when the tab is hidden to prevent memory leak (Joseph Tary)

 * Fix jshint style (Raymond Feng)

 * Add Subscription.getProducts() (Raymond Feng)

 * Remove the deprecation warning (Raymond Feng)

 * Fix the callback (Raymond Feng)

 * Work around the gulp hang (Raymond Feng)

 * Update auth url (Raymond Feng)

 * retrofit ui-inputs on arc (Anthony Ettinger)

 * Use the proxy login and reload subscriptions (Raymond Feng)

 * Add an observer to pm actions to push licenses (Raymond Feng)

 * Update deps (Raymond Feng)

 * Add arc apis to manage subscriptions (Raymond Feng)

 * add support for --login flag to arc (Anthony Ettinger)

 * fix metrics memory leak (seanbrookes)

 * add contextual help based on app selector to header navbar (Anthony Ettinger)

 * delete x should appear on hover (Anthony Ettinger)

 * add checkboxes on composer (Anthony Ettinger)

 * add new button styles to arc from the styleguide (Anthony Ettinger)

 * add validation to "add host" form (Anthony Ettinger)

 * re-order modules on landing page (Anthony Ettinger)

 * swap build-and-deploy and profiler on landing page (Anthony Ettinger)

 * cleanup header and navbar (Anthony Ettinger)

 * tests: loosen timeouts to account for slow VMs (Ryan Graham)

 * make comparison as lower case to ensure matches (seanbrookes)

 * add outside clickable trigger on info popovers (Anthony Ettinger)

 * remove dead / commented markup (seanbrookes)


2015-02-08, Version 1.1.0
=========================

 * fix wrapping text in menu (Anthony Ettinger)

 * fix missing app selector for process-manager (Anthony Ettinger)

 * pid count updates (seanbrookes)

 * re-enable add host link when host is added (Anthony Ettinger)

 * lower bound for port input (Anthony Ettinger)

 * fix ui tweaks on Load balance in PM (Anthony Ettinger)

 * - upgrade status interaction (seanbrookes)

 * process-manager: disable pmctl channel (Sam Roberts)

 * design tweaks to PM (Anthony Ettinger)

 * - clean out comments (seanbrookes)

 * - visual design load balancer (seanbrookes)

 * add proper colum names for pids on PM (Anthony Ettinger)

 * add the add-row feature to PM (Anthony Ettinger)

 * enforce a promise interface on metrics chart config loader (Anthony Ettinger)

 * re-apply downstream fixes to styleguide (Anthony Ettinger)

 * - visual design application (seanbrookes)

 * add status buttons and icons for styleguide (Anthony Ettinger)

 * fix delayed load balancer rendering (seanbrookes)

 * Rename Manager to Process Manager (Ritchie Martori)

 * add popover info example to styleguide (Anthony Ettinger)

 * fix cluster restart (seanbrookes)

 * initial manager module (seanbrookes)

 * remove extra events in SG controller (Anthony Ettinger)

 * uncomment hidden style modules (Anthony Ettinger)

 * add action menu to styleguide (Anthony Ettinger)

 * uncomment hidden modules on styleguide (Anthony Ettinger)

 * add table form to styleguide (Anthony Ettinger)

 * functionally complete with new gauges (seanbrookes)

 * live styleguide (Anthony Ettinger)

 * use standard error color on composer model name (Anthony Ettinger)

 * change wording on deploy success message (Anthony Ettinger)

 * merge exception logic (seanbrookes)

 * Update deps to use ^ in version specs (Miroslav Bajtoš)

 * fix layout when zooming build & deploy (Anthony Ettinger)

 * client/test: nuke sandbox as part of reset (Ryan Graham)

 * client: more gracefully handle bad errors (Ryan Graham)

 * add shutoff in case of app start error (seanbrookes)

 * client/pm: app is running when a worker exists (Sam Roberts)

 * Default to one-shot mode for App Controller start (Sam Roberts)

 * tweak exception syntax again (seanbrookes)

 * make exception response handling more robust (seanbrookes)

 * fix label for selected pid in profiler (Anthony Ettinger)

 * rename request interceptor to match module (seanbrookes)


2015-01-12, Version 1.0.4
=========================

 * tweaks to tagline and readme (seanbrookes)

 * add setScrollView method call to ds view to trigger scroll bars (seanbrookes)

 * add url field to DataSource form UI (seanbrookes)

 * handle logout errors on api call (Anthony Ettinger)

 * remove video from landing page (Anthony Ettinger)

 * update landing page with new look and feel (Anthony Ettinger)

 * hide port if local host (Anthony Ettinger)

 * update landing disabled icons with pointer (Anthony Ettinger)

 * fix bug when deleting datasources (Anthony Ettinger)

 * Fix bad CLA URL in CONTRIBUTING.md (Ryan Graham)

 * fix broken unit test (Anthony Ettinger)

 * load lodash into tests (Anthony Ettinger)

 * fix erroneous link in error message (Anthony Ettinger)

 * change datasource to data source (Anthony Ettinger)


2014-12-22, Version 1.0.3
=========================

 * trigger build (seanbrookes)

 * check to make sure app is running before polling (seanbrookes)

 * fix model definition name reference (seanbrookes)

 * fix incorrect links (seanbrookes)

 * refactor model editor from react to angular (seanbrookes)

 * added missing CONST object (altsang)

 * add segmentio calls to identify module on (altsang)

 * update default model datasource options (seanbrookes)

 * - refactor model property editor back to Angular - add 'endter key' save on model name - fixed regression on #460 property data types (seanbrookes)

 * add iframe onload handler for profiler (Anthony Ettinger)

 * fixup! add growl warning (Miroslav Bajtoš)

 * move lb-services out of the way to prevent overwrite (seanbrookes)

 * - fix spelling - adjust sgment io available test logic (seanbrookes)

 * fix unit test fails (seanbrookes)

 * add segment io lib refs (seanbrookes)

 * add tracking to build and deploy module (altsang)

 * corrected malformed comment (altsang)

 * moved segmentio initialization to Arc.run (altsang)

 * added in more service methods for user (altsang)

 * add angular-segmentio scripts (altsang)

 * segment.io library added (altsang)

 * add user save data service (altsang)

 * discovery: always import id and required props (Miroslav Bajtoš)


2014-12-17, Version 1.0.2
=========================

 * devtools: fix SplitView in Safari (Miroslav Bajtoš)

 * devtools: automatically prefix styles (Miroslav Bajtoš)

 * Remove PORT from env to avoid passing it to embeded pm (Ritchie Martori)


2014-12-17, Version 1.0.1
=========================

 * Trim trailing whitespace (Ryan Graham)

 * Update README.md (Rand McKinney)

 * Updated for GA (Rand McKinney)


2014-12-16, Version 1.0.0
=========================

 * Add Number.isInteger polyfil (Ryan Graham)

 * removed property update on change flow (seanbrookes)

 * fix orphaned spinner in the pid selector (seanbrookes)

 * Remove duplicate warning about unavailable metrics (Ryan Graham)

 * fix profiler init issues with file mode (seanbrookes)

 * adjust app controller icon start/stopped color (Anthony Ettinger)

 * Point help button at Arc docs (Ryan Graham)

 * add early beta access to app selector (Anthony Ettinger)

 * remove loop count from loop chart controls (seanbrookes)

 * add slightly darker background on buttons when clicked (seanbrookes)

 * fix unstyled datasource save button (seanbrookes)

 * ensure active instance is refreshed when editor view reloaded (seanbrookes)

 * package: update strong-pm to ^1.5.x (Sam Roberts)

 * fix broken logout dropdown menu (seanbrookes)

 * adjust font color and size of chart control nav items (seanbrookes)

 * adjust interval back to recommended (seanbrookes)

 * update arc author (seanbrookes)

 * - disable autostart app (seanbrookes)

 * fix right margin on chart getting clipped. (seanbrookes)

 * add 'early preview' tag to Metrics app on landing (seanbrookes)

 * update the growl message to match text in issue (seanbrookes)

 * fix timing issue with model/property create (seanbrookes)

 * change landing page and other ui fixups (Anthony Ettinger)

 * disabled the metrics panel when there is no data (Anthony Ettinger)

 * fix code spacing (seanbrookes)

 * - tighten up logic around pm host persistence (seanbrookes)

 * close (seanbrookes)

 * incremental changes (seanbrookes)

 * - add autoload to processes - add spinner to load process flow (seanbrookes)

 * add cursor to app-controller (Anthony Ettinger)

 * metrics cleanup (seanbrookes)

 * Add start-stop and circle icons to font icons (Anthony Ettinger)

 * add generic popover for disabled apps (Anthony Ettinger)

 * adjust bottom margin on pid selector (Anthony Ettinger)

 * preselect pid in pid selector (Anthony Ettinger)

 * pm: use process.execPath (Ryan Graham)

 * Add strong-build dependency (Ryan Graham)

 * only add the pm instance once - and at the end (seanbrookes)

 * change query string keyword from where to filter (seanbrookes)

 * fix incorrect data property reference (seanbrookes)

 * change started icon for app controller (Anthony Ettinger)

 * stop migrate button from submitting form by default (Anthony Ettinger)

 * hide app controller if user is logged out (Anthony Ettinger)

 * change universal in deploy message to tar file (Anthony Ettinger)

 * rearrange CPU chart controls (seanbrookes)

 * begin to move pm host form out of pid selector (seanbrookes)

 * implement visual design on app controller (Anthony Ettinger)

 * add archive filename label to build tar file form (Anthony Ettinger)

 * - refactored the polling to be less memory heavy (seanbrookes)

 * add 'select a process' to pid selector label (Anthony Ettinger)

 * hide pointer on placeholder icons (Anthony Ettinger)

 * fix: syntax error, missing { (Ryan Graham)

 * Don't load entire app for -v and -h (Ryan Graham)

 * Defer starting process-manager until app start (Ryan Graham)

 * Don't save model config as attributes (Ryan Graham)

 * add unsupported icons to landing page (Anthony Ettinger)

 * Remove generated css file (Ryan Graham)

 * Hide spinner controls from port input fields (Ryan Graham)

 * additional code cleanup (seanbrookes)

 * change tarball to tar file (Anthony Ettinger)

 * local app stop/start (seanbrookes)

 * Move jsx transform to server (Ryan Graham)

 * Refactor propery update (Ritchie Martori)

 * change strong arc to stronloop arc (Anthony Ettinger)

 * arc metaphor landing page (Anthony Ettinger)

 * re-initialize profiler when clicking load button (Anthony Ettinger)

 * Manual merge (Ritchie Martori)

 * Add install arg for git builds (Ritchie Martori)

 * Remove unused archive input (Ritchie Martori)

 * Change universal to Tarball and switch default (Ritchie Martori)

 * revert jsxtransform update (seanbrookes)

 * Refactor embedded process manager (Ritchie Martori)

 * process-manager: attach IPC channel to pm child (Sam Roberts)

 * process-manager: use better regex (Sam Roberts)

 * Remove strong-pm dir on start and exit (Ritchie Martori)

 * Ensure the PORT is stored for pm proxied request (Ritchie Martori)

 * Fix baseURL for local deployments (Ritchie Martori)

 * update jsx/react version to fix Firfox source issue (seanbrookes)

 * add flag to model create flow to prevent race (seanbrookes)

 * filter out dead pids (Anthony Ettinger)

 * fix bug where success looked like an error (Anthony Ettinger)

 * fix broken test file references (seanbrookes)

 * fix module name reference error (seanbrookes)

 * metrics visualization spike (seanbrookes)

 * update model properties from onchange event (Anthony Ettinger)

 * Add disabled state for arc apps (Ritchie Martori)

 * Init (Ritchie Martori)

 * Make async full (non dev) dependency (Ritchie Martori)

 * Default to 1 proc for local deploy Use default config for all deployments (Ritchie Martori)

 * disable profiler radio buttons when profiling (Anthony Ettinger)

 * text changes for arc (Anthony Ettinger)

 * Remove references to STUDIO env vars (Anthony Ettinger)

 * change route from /#studio to /# (Anthony Ettinger)

 * add simple preserve strong-pm server reference (seanbrookes)

 * add popover for menus (Anthony Ettinger)

 * Add an embeded process manager (Ritchie Martori)

 * force contextual help links to open in new window (Anthony Ettinger)

 * fix resize issue hiding profiler header on iframe loading (seanbrookes)

 * add dark gray background to profiler (Anthony Ettinger)

 * deps: bump strong-deploy dependency (Ryan Graham)

 * Support local deployment (Sam Roberts)

 * Fix call to git deploy from strong-deploy (Sam Roberts)

 * Update README.md (poldridge)

 * hide file button when remote default state is set (Anthony Ettinger)

 * UI Fixups for build and deploy (Anthony Ettinger)

 * add spinner to build and deploy (Anthony Ettinger)

 * fix endpoint for deploy (Anthony Ettinger)

 * remove deprecated code (Anthony Ettinger)

 * swap file and remote in profiler (Anthony Ettinger)

 * refactor profiler references to new endpoints (Anthony Ettinger)

 * add better error handling for build and deploy (Anthony Ettinger)

 * Remove auto-generated strongloop.css from git (Miroslav Bajtoš)

 * Remove "npm install loopback-explorer" log (Miroslav Bajtoš)

 * bin/cli: rename Studio to Arc (Miroslav Bajtoš)

 * update pid module to reflect rest api changes (seanbrookes)

 * fix error object reference in try/catch block (seanbrookes)

 * Fix the ability to set array type on model property (seanbrookes)

 * client: use the local help files (Miroslav Bajtoš)

 * Gulpfile: download help assets (Miroslav Bajtoš)

 * add new landing page icons (Anthony Ettinger)

 * Build and deploy wireframe (Anthony Ettinger)

 * rename arc in the version file generator (seanbrookes)

 * Fix bug where file vs. remote isn't reseting (Anthony Ettinger)

 * arc rename (seanbrookes)

 * Update README (Raymond Feng)

 * Rename the github repo to strong-arc (Raymond Feng)

 * Add contextual help directive (Anthony Ettinger)

 * Add other apps to landing page (Anthony Ettinger)

 * Refactor pid selector into a directive (Anthony Ettinger)

 * Fix broken link (Anthony Ettinger)

 * Move hardcoded colors out of css (Anthony Ettinger)

 * Update devtools css with design spec (Anthony Ettinger)

 * Always show help message for the global error (Miroslav Bajtoš)

 * Show custom help for missing oracle connector (Miroslav Bajtoš)

 * Remove old code (Anthony Ettinger)

 * add scrollable page layout (Anthony Ettinger)

 * Rebuild css (Anthony Ettinger)

 * add profiler navbar (Anthony Ettinger)

 * bin: add --help and --version (Miroslav Bajtoš)

 * Remove sandbox files from git. (Miroslav Bajtoš)

 * test-server: forward Karma/Protractor exit code (Miroslav Bajtoš)

 * Fix for inability to edit property comments (seanbrookes)

 * - clean up logic around test for array type (seanbrookes)

 * Protractor e2e POC and init tests (seanbrookes)

 * client/test/integration: fix datasource tests (Miroslav Bajtoš)

 * - replace missing ds update test (seanbrookes)

 * - fix timeout issue on datasource test spec (seanbrookes)

 * - fix erroneous response property reference (seanbrookes)

 * - add unit tests to cover some of the changed functionality - fix broken datasource unit test (seanbrookes)

 * fix not all model properties getting rendered (seanbrookes)

 * Redirect user if they are logged in and land on homepage (Anthony Ettinger)

 * client: ignore readonly models (Miroslav Bajtoš)

 * convert css to less (Anthony Ettinger)

 * implement stop and start app buttons in UI (seanbrookes)

 * Update icons to v3 (Anthony Ettinger)

 * refactor studio and composer into modules (seanbrookes)

 * client: rework page title (Miroslav Bajtoš)

 * client/test: increase timeout for slow tests (Miroslav Bajtoš)

 * gulpfile: group all less tasks (Miroslav Bajtoš)

 * client/test: use unique port number (Miroslav Bajtoš)

 * client: remove style.css from version control (Miroslav Bajtoš)

 * client: build workspace services using gulp (Miroslav Bajtoš)

 * Provide npm with a real .npmignore (Ryan Graham)


2014-10-30, Version 0.2.1
=========================

 * client: ignore readonly models (Miroslav Bajtoš)


2014-10-01, Version 0.2.0
=========================

 * Bump version (Raymond Feng)

 * Update contribution guidelines (Ryan Graham)

 * Change classes to .ui-msg-inline (Anthony Ettinger)

 * Apply styles to error messages on testConnection button (Anthony Ettinger)

 * Add license (Raymond Feng)

 * - add logic to the global exception display component to allow for the help text to contain more structure including hyperlinks to help give users additional help when they run into known problems (seanbrookes)

 * fix not showing discover menu item (seanbrookes)

 * client/explorer: fix error handling (Miroslav Bajtoš)

 * client/explorer: ensure app is running (Miroslav Bajtoš)

 * client/test: use Workspace.start/stop (Miroslav Bajtoš)

 * client: update workspace client services (Miroslav Bajtoš)

 * Align message text with button text (Anthony Ettinger)

 * Fix display of success message on test button (Anthony Ettinger)

 * fix for invalid / unsaved datsource triggering discovery flow pre-maturely (seanbrookes)

 * Convert datasource.css to less (Anthony Ettinger)

 * update context menu for discoverable datasource (seanbrookes)

 * implement test for valid project when starting api composer - still some work to do as there are dependencies between studio and composer that need to cleaned up in the process of creating a more comprehensive exception handling strategy across the apps (seanbrookes)

 * Refactor code to not require pageId defined explicitly on every controller. (Anthony Ettinger)

 * Remove route change event infavor of each page defining its "appId". (Anthony Ettinger)

 * clear selectedApp when navigating. (Anthony Ettinger)

 * fix delete model cause editor view to disappear. (seanbrookes)

 * Fixes #337 (seanbrookes)

 * Hide button in topnav for profiler (Anthony Ettinger)

 * Text changes for profiler (Anthony Ettinger)

 * move a js file to try and get the  unit tests to run in CI (seanbrookes)

 * implement prototype$createModel (seanbrookes)

 * fix broken test (seanbrookes)

 * add support for angular-spin activity indicator (seanbrookes)

 * Pass in the options.schema for selected models (Raymond Feng)

 * client: use connectorMetadata to detect discovery (Miroslav Bajtoš)

 * client: use connectorMetadata to detect migration (Miroslav Bajtoš)

 * client: use connectorMetadata in datasource form (Miroslav Bajtoš)

 * client: load connectorMetadata in studio (Miroslav Bajtoš)

 * modify disabled attribute logic in directives (seanbrookes)

 * Discovery flow polish - updated ng-grid library - updated CSS - modified some wizard flow logic to manage selectAll button (seanbrookes)

 * client: implement `WorkspaceService.valiate` (Miroslav Bajtoš)

 * trigger resize event on window to work around data glitch on discovery step 1. (Anthony Ettinger)

 * Force dropdown menu item from Logout button to expand the full width of the menu container. (Anthony Ettinger)

 * fix placement of navbar when clicking Logout. (Anthony Ettinger)

 * Tell CI not to run mocha directly (Ryan Graham)

 * Fix build (Ritchie Martori)

 * hide app selector on un-related pages. should only be visible on api composer and profiler pages. (Anthony Ettinger)

 * client: use `modelPropertyTypes` in model form (Miroslav Bajtoš)

 * client/test: infrastructure for MySQL datasource (Miroslav Bajtoš)

 * client/test: add ES5 shims for PhantomJS (Miroslav Bajtoš)

 * gulpfile: add gulpfile to jshint inputs (Miroslav Bajtoš)

 * gulpfile: extract "pull-devtools" to a new file (Miroslav Bajtoš)

 * package: use workspace from npmjs.org (Miroslav Bajtoš)

 * bringing discovery flow back into studio (seanbrookes)

 * client/explorer: use host from project config (Miroslav Bajtoš)

 * hide start button and record heap allocations (Anthony Ettinger)

 * fix font sizing on landing page (Anthony Ettinger)

 * add graphics to landing page and re-visit design. add isAuth method in suite controller add descriptions to app data (Anthony Ettinger)

 * client: Fix given.dataSourceInstance (Miroslav Bajtoš)

 * add stub for app selector add ui selector style ui selector and add more apps to data file for testing. add icons to menu add note about renaming .ui class names to be generic refactor drop down selector to pre-select menu item from page controllers. remove timers, infavor of ng-mouseleave calling hideMenu() directly. remove underscores in filenames. remove extraneous reference to scope.selectedApp (Anthony Ettinger)

 * fixes the issue where users have to save their model before adding properties (seanbrookes)

 * client: add ExplorerService.getSwaggerResources (Miroslav Bajtoš)

 * examples/empty: allow cross-origin requests (Miroslav Bajtoš)

 * client: fix karma.integration.js (Miroslav Bajtoš)

 * examples: revert unintentional change in 9a35e93e (Miroslav Bajtoš)

 * move icons.css into icons.less and add abstraction layer for wrapping font icon class names. (Anthony Ettinger)

 * Squash commits for file/class sync for font icons. (Anthony Ettinger)

 * #254 refactor strongloop font css to have seperate namespace than bootstrap icons (Anthony Ettinger)

 * #252  add checkmark and checkmark-outline to icon font (Anthony Ettinger)

 * - add grunt watch task for automatically building less to css when a file changes. - add standard .editorconfig to define spacing/tab indentation rules. - mixins.less - add more bottom margin to products (re: stacy) - change products to apps throughout feature. - fix header link - remove -src ref in ./less directories - use more verbose class name - change editorconfig to space instead of tab - refactor ajax call in landing service to not use deferred. - fix gulp line to 80 chars wide (Anthony Ettinger)

 * fix localStorage dynamic port issue (seanbrookes)


2014-09-09, Version 0.1.0
=========================

 * First release!
