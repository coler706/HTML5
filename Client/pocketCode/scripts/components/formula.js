/// <reference path="../../../smartJs/sj.js" />
/// <reference path="../core.js" />
/// <reference path="parser.js" />
'use strict';

PocketCode.Formula = (function () {
    Formula.extends(SmartJs.Core.Component);

    function Formula(device, sprite, jsonFormula) {

        if (!device || !sprite)
            throw new Error('invalid parameter: undeclared device or sprite');
        this._device = device;
        this._sprite = sprite;
        this._userVariableHost = sprite;    //default

        if (jsonFormula !== undefined)   //null is allowed
            this.json = jsonFormula;
    }

    //accessors
    Object.defineProperties(Formula.prototype, {
        isStatic: {
            value: false,
            writable: true,
        },
        json: {
            get: function () {
                return this._json;
            },
            set: function (value) {
                this._json = value;
                var parsed = PocketCode.FormulaParser.parseJson(value); //return {calculate: [Function], isStatic: [boolean]}
                if (parsed.isStatic) {
                    this.isStatic = true;
                    this._calculate = parsed.calculate;  //to map scope to formula (currently scope = parsed)
                    var val = this._calculate();
                    val = (typeof val !== 'string') ? val : '\'' + val.replace(/(')/g, '\\$1').replace(/(\n)/g, '\\n') + '\'';
                    val = 'return ' + val + ';';
                    this._calculate = new Function(val);
                }
                else {
                    this.isStatic = false;
                    this._calculate = parsed.calculate;
                }
                this._validateFormula();
            },
        },
    });

    //methods
    Formula.prototype.merge({
        calculate: function (scope) {
            if (this._json !== undefined)   //null is allowed
                return this._calculate(scope);
            throw new Error('No Formula object loaded');
        },
        _degree2radian: function (val) {
            return val * (Math.PI / 180.0);
        },
        _radian2degree: function (val) {
            return val * (180.0 / Math.PI);
        },
        _log10: function (val) {
            return Math.log(val) / Math.LN10;
        },
        _validateFormula: function () {
            try {
                var formula = new PocketCode.Formula(this._device, this._sprite);
                formula._sprite = { //override sprite to enable validation during parsing
                    brightness: 100,
                    transparency: 0,
                    colorEffect: 0,
                    currentLookNumber: 1,
                    currentLookName: 2,
                    layer: 1,
                    direction: 90,
                    size: 100,
                    positionX: 0,
                    positionY: 0,
                    volume: 100,
                    collidesWithEdge: false,
                    collidesWithPointer: true,
                    velocityX: 0,
                    velocityY: 0,
                    velocityAngular: 0,
                    getVariable: function (id) { return new PocketCode.Model.UserVariableSimple(id, 'undefined'); },
                    getList: function (id) { return new PocketCode.Model.UserVariableList(id, 'undefined'); },
                    collidesWithSprite: function (name) { return true; },
                };
                var test = this._calculate.call(formula);    //execute generated calculate method in testFormula
            }
            catch (e) {
                throw new Error('Error parsing formula: ' + e.message);
            }
        },
        toString: function (uvh) {
            this._userVariableHost = (uvh instanceof PocketCode.Model.UserVariableHost) ? uvh : this._sprite;
            return PocketCode.FormulaParser.getUiString(this._json, this._userVariableHost.getAllVariables(), this._userVariableHost.getAllLists());
        },
        dispose: function () {
            this._device = undefined;
            this._sprite = undefined;
            this._userVariableHost = undefined;
            SmartJs.Core.Component.prototype.dispose.call(this);
        },
    });

    return Formula;
})();