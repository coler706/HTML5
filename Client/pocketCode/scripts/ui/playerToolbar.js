﻿/// <reference path="../../../smartJs/sj.js" />
/// <reference path="../../../smartJs/sj-core.js" />
/// <reference path="../../../smartJs/sj-event.js" />
/// <reference path="../../../smartJs/sj-components.js" />
/// <reference path="../../../smartJs/sj-ui.js" />
/// <reference path="../core.js" />
'use strict';

PocketCode.Ui.merge({

    /*
    orientation: h = horizontal, v = vertical
    position: lo = left & outside, bi = bottom & inside
    hideable: indicated if the menu is hidden when starting the game or on other events (e.g. back button, ..)
    hideOnStart: indicates if the menu is shown by default and moved out (animation) during start = for IOS devices (no back button)
    showOnGesture: indicates if the menu is bound to a page event to show it based on gesture events = for IOS devices (no back button)
    */
    PlayerToolbarSettings: {
        DESKTOP: { orientation: 'v', position: 'lo', hideable: false, animatedShowHide: false, hideOnStart: false, showOnGesture: false },
        MOBILE: { orientation: 'h', position: 'bi', hideable: true, animatedShowHide: true, hideOnStart: false, showOnGesture: false },
        MOBILE_IOS: { orientation: 'v', position: 'bi', hideable: true, animatedShowHide: true, hideOnStart: true, showOnGesture: true },
    },

    PlayerBtnCommand: {
        BACK: 2,
        RESTART: 3,
        START: 4,
        PAUSE: 5,
        SCREENSHOT: 6,
        AXES: 7,
    },

    PlayerToolbar: (function () {
        PlayerToolbar.extends(SmartJs.Ui.Control, false);

        function PlayerToolbar(settings) {
            if (!settings || !settings.orientation)
                throw new Error('invalid argument: constructor settings');
            this._settings = settings;

            SmartJs.Ui.Control.call(this, 'div', { className: 'pc-playerMenu' + settings.orientation.toUpperCase() });// + ' pc-overlay' });
            //this._inactiveOverlay = new SmartJs.Ui.Control('div', { className: 'pc-overlay' });
            this._appendChild(new SmartJs.Ui.Control('div', { className: 'pc-overlay' }));//this._inactiveOverlay);

            //internal settings (for scaling)
            this._defaultHeight = 550;  //all buttons at 10px font-size (vertical)
            this._defaultWidth = 374;   //(horizontal)

            if (settings.position == 'bi') { //with green background
                this._overlay = new SmartJs.Ui.Control('div', { className: 'pc-playerMenuOverlay' });
                this._overlayBtn = new SmartJs.Ui.ContainerControl({ className: 'pc-playerMenuPlayOverlay' });
                this._overlayBtn._dom.appendChild(document.createElement('div'));

                if (settings.showOnGesture) {
                    var touchArea = this._overlayBtn._dom;
                    this._addDomListener(touchArea, 'touchstart', this._openMenuTabbedHandler);
                    this._addDomListener(touchArea, 'mousedown', this._openMenuClickedHandler);
                }
                this._appendChild(this._overlay);
                this._appendChild(this._overlayBtn);
            }

            this._menuContainer = new SmartJs.Ui.ContainerControl({ className: 'pc-playerMenuContainer' });
            if (settings.position == 'lo') {
                this._menuContainer.addClassName('pc-playerMenuOutside');
            }
            this._appendChild(this._menuContainer);
            this._menuContainerAlign = new SmartJs.Ui.ContainerControl({ className: 'pc-alignedCell' });
            this._menuContainer.appendChild(this._menuContainerAlign);

            //buttons
            // i18n: btnBack
            this._backButton = new PocketCode.Ui.PlayerSvgButton(PocketCode.Ui.SvgImageString.BACK, 'btnBack');
            this._backButton.addClassName('pc-rtl');
            this._backButtonDisabled = false;
            this._backButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.BACK }); }, this));
            this._menuContainerAlign.appendChild(this._backButton);
            // i18n: btnRestart
            this._restartButton = new PocketCode.Ui.PlayerSvgButton(PocketCode.Ui.SvgImageString.RESTART, 'btnRestart');
            this._restartButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.RESTART }); }, this));
            this._menuContainerAlign.appendChild(this._restartButton);
            // i18n: btnStart
            this._startButton = new PocketCode.Ui.PlayerSvgButton(PocketCode.Ui.SvgImageString.PLAY, 'btnStart', true);
            this._startButton.addClassName('pc-rtl');
            this._startButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.START }); }, this));
            this._menuContainerAlign.appendChild(this._startButton);
            // i18n: btnPause
            this._pauseButton = new PocketCode.Ui.PlayerSvgButton(PocketCode.Ui.SvgImageString.PAUSE, 'btnPause', true);
            this._pauseButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.PAUSE }); }, this));
            this._menuContainerAlign.appendChild(this._pauseButton);
            this._pauseButton.hide();   //default- for execution state = STOPPED
            // i18n: btnScreenshot
            this._screenshotButton = new PocketCode.Ui.PlayerSvgButton(PocketCode.Ui.SvgImageString.SCREENSHOT, 'btnScreenshot');
            this._screenshotButtonDisabled = true;
            this._screenshotButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.SCREENSHOT }); }, this));
            this._menuContainerAlign.appendChild(this._screenshotButton);
            // i18n: btnAxes
            this._axesButton = new PocketCode.Ui.PlayerSvgButton(PocketCode.Ui.SvgImageString.AXES, 'btnAxes');
            this._axesButtonDisabled = true;
            this._axesButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.AXES }); }, this));
            this._menuContainerAlign.appendChild(this._axesButton);

            //// i18n: menuButton
            //PocketCode.Menu = new PocketCode.Ui.Menu();
            //var button1 = new PocketCode.Ui.MenuItem("example");
            //console.log( PocketCode.I18nProvider);

            //PocketCode.Menu.appendChild( button1 );
            ////this.MenuDisabled = false;
            ////this._axesButton.onClick.addEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.AXES }); }, this));
            //// this._menuContainerAlign.appendChild(this.Menu);
            //console.log( this );
            //var asd = PocketCode.Web.PlayerInterface._webOverlay;
            ////asd.Menu = this.Menu;
            //console.log( asd.muteButton.parentNode );
            //var p = document.createElement("p");
            //asd.muteButton.parentNode.appendChild( PocketCode.Menu._dom );
            //console.log( asd );

            //console.log( asd );
            //console.log( "---" );

            this._executionState = PocketCode.ExecutionState.STOPPED;
            this._onResize.addEventListener(new SmartJs.Event.EventListener(this._resizeHandler, this)); //TODO: check if handling is necesary twice
            this._onResize.addEventListener(new SmartJs.Event.EventListener(function () { window.setTimeout(this._resizeHandler.bind(this, this), 120); }.bind(this), this));

            //events
            this._onButtonClicked = new SmartJs.Event.Event(this);
        }

        //events
        Object.defineProperties(PlayerToolbar.prototype, {
            onButtonClicked: {
                get: function () {
                    return this._onButtonClicked;
                },
            }
        });

        //properties
        Object.defineProperties(PlayerToolbar.prototype, {
            executionState: {
                set: function (value) {
                    switch (value) {
                        case PocketCode.ExecutionState.ERROR:
                            this.disabled = true;
                            break;
                        case PocketCode.ExecutionState.RUNNING:
                            this._startButton.hide();
                            this._pauseButton.show();
                            this._hideOverlay();
                            break;
                        case PocketCode.ExecutionState.PAUSED:
                            this._pauseButton.hide();
                            this._startButton.i18nKey = 'btnResume';
                            this._startButton.show();
                            this._showOverlay();
                            break;
                        default:
                            this._pauseButton.hide();
                            this._startButton.i18nKey = 'btnStart';
                            this._startButton.show();
                            this._showOverlay();
                            break;
                    }
                    this._executionState = value;
                },
                get: function () {
                    return this._executionState;
                },
            },
            /* override */
            //hidden: {
            //    get: function () {
            //        if (this._settings.position == 'lo')    //in desktop mode the toolbar is not hidden, even if the width (overlay) is set to 0
            //            return false;
            //        if (this.height === 0 || this.width === 0)
            //            return true;
            //        return false;
            //    },
            //},
            disabled: {
                set: function (value) {
                    if (typeof value !== 'boolean')
                        throw new Error('invalid argument: expected type: boolean');

                    if (this._backButtonDisabled)
                        this._backButton.disabled = true;
                    else
                        this._backButton.disabled = value;
                    this._restartButton.disabled = value;
                    this._startButton.disabled = value;
                    this._pauseButton.disabled = value;
                    if (this._screenshotButtonDisabled)
                        this._screenshotButton.disabled = true;
                    else
                        this._screenshotButton.disabled = value;

                    if (this._axesButtonDisabled)
                        this._axesButton.disabled = true;
                    else
                        this._axesButton.disabled = value;
                },
            },
            axesButtonChecked: {
                set: function (value) {
                    if (typeof value !== 'boolean')
                        throw new Error('invalid argument: expected type: boolean');
                    this._axesButton.checked = value;
                },
            },
            axesButtonDisabled: {
                set: function (value) {
                    if (typeof value !== 'boolean')
                        throw new Error('invalid argument: expected type: boolean');
                    this._axesButtonDisabled = value;
                    this._axesButton.disabled = value;
                },
            },
            backButtonDisabled: {
                set: function (value) {
                    if (typeof value !== 'boolean')
                        throw new Error('invalid argument: expected type: boolean');
                    this._backButtonDisabled = value;
                    this._backButton.disabled = value;
                },
            },
            screenshotButtonDisabled: {
                set: function (value) {
                    if (typeof value !== 'boolean')
                        throw new Error('invalid argument: expected type: boolean');
                    this._screenshotButtonDisabled = value;
                    this._screenshotButton.disabled = value;
                },
            },
        });

        //methods
        PlayerToolbar.prototype.merge({
            _openMenuTabbedHandler: function (e) {
                if (this._executionState == PocketCode.ExecutionState.RUNNING)
                    this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.BACK });
                e.preventDefault();
            },
            _openMenuClickedHandler: function(e) {
                if (this._executionState == PocketCode.ExecutionState.RUNNING) {
                    if (e.button == 0) { // left click
                        this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.BACK });
                        e.preventDefault();
                    }
                }
            },
            _resizeHandler: function (args) {
                //if (this.hidden)
                //    return;

                if (this._settings.orientation == 'h') {
                    var fontSize = 10 * this.width / this._defaultWidth;
                    this.style.fontSize = Math.min(fontSize, 12) + 'px';
                }
                else {
                    var fontSize = 10 * this.height / this._defaultHeight;
                    this.style.fontSize = Math.min(fontSize, 13) + 'px';
                }
            },
            _hideOverlay: function () {
                var settings = this._settings;
                if (settings.orientation == 'h')
                    this.style.height = '0px';
                else
                    this.style.width = '0px';

                if (this._overlay)
                    this._overlay.hide();

                if (this._overlayBtn) {
                    if (settings.showOnGesture)
                        this._overlayBtn.addClassName('pc-iOsClosed');
                    else
                        this._overlayBtn.hide();
                }
                        
                if (settings.position !== 'lo')
                    this._menuContainer.hide();
            },
            _showOverlay: function() {
                var settings = this._settings;
                this.style.height = '';
                this.style.width = '';

                if (this._overlay)
                    this._overlay.show();

                if (this._overlayBtn) {
                    this._overlayBtn.removeClassName('pc-iOsClosed');
                    this._overlayBtn.show();
                }
                this._menuContainer.show();
            },
            dispose: function () {
                this._onResize.dispose();
                this._backButton.onClick.removeEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.BACK }); }, this));
                this._restartButton.onClick.removeEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.RESTART }); }, this));
                this._startButton.onClick.removeEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.START }); }, this));
                this._pauseButton.onClick.removeEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.PAUSE }); }, this));
                this._screenshotButton.onClick.removeEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.SCREENSHOT }); }, this));
                this._axesButton.onClick.removeEventListener(new SmartJs.Event.EventListener(function (e) { this.onButtonClicked.dispatchEvent({ command: PocketCode.Ui.PlayerBtnCommand.AXES }); }, this));

                SmartJs.Ui.Control.prototype.dispose.call(this);
            },
        });

        return PlayerToolbar;
    })(),

});

