﻿/// <reference path="../../qunit/qunit-2.4.0.js" />
/// <reference path="../../../Client/smartJs/sj-event.js" />
/// <reference path="../../../Client/pocketCode/scripts/model/bricksCore.js" />
/// <reference path="../../../Client/pocketCode/scripts/model/bricksControl.js" />
/// <reference path="../../../Client/pocketCode/scripts/components/device.js" />
/// <reference path="../../../Client/pocketCode/scripts/components/gameEngine.js" />
/// <reference path="../../../Client/pocketCode/scripts/model/sprite.js" />
'use strict';

QUnit.module("model/sprite.js");


QUnit.test("Sprite", function (assert) {

    // var programExecAsync = assert.async();
    var testsExecAsync = assert.async();
    var finalAsyncCall = assert.async();
    var asyncCalls = 0; //check all async calls where executed before running dispose

    var gameEngine = new PocketCode.GameEngine();
    var scene = new PocketCode.Model.Scene(gameEngine, undefined, []);

    var sprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    assert.ok(sprite instanceof PocketCode.Model.Sprite && sprite instanceof PocketCode.Model.UserVariableHost && sprite instanceof SmartJs.Core.Component, "instance check");

    assert.ok(sprite.onExecuted instanceof SmartJs.Event.Event, "event instances + getter");
    //triggerOnChange
    assert.notOk(sprite._triggerOnChange({}), "call private _triggerOnChange: make sure an empty property does not trigger update");

    //timer (currently not in use)
    //assert.equal(sprite.projectTimerValue, gameEngine.projectTimer.value, "timer getter");

    //dispose: this is called after the last async test to avoid errors 
    var disposeTest = function () {
        if (asyncCalls < 2)
            //return;
            sprite.dispose();
        assert.ok(sprite._disposed, "sprite disposed");
        finalAsyncCall();
    };

    //attach listener to get latest changes
    var lastOnChangeArgs;
    var onChangeHandler = function (e) {
        lastOnChangeArgs = e.properties;
    };
    sprite._onChange.addEventListener(new SmartJs.Event.EventListener(onChangeHandler, this));

    //properties
    assert.throws(function () { var err = new PocketCode.Model.Sprite(gameEngine, scene); }, Error, "missing ctr arguments");
    assert.equal(sprite.id, "newId", "id ctr setter");
    assert.equal(sprite.name, "myName", "name ctr setter");

    assert.throws(function () { sprite.looks = undefined; }, Error, "ERROR: setting looks");
    var looks = [{ id: 1, imageId: "s1", name: "name1" }, { id: 2, imageId: "s2", name: "name2" }];
    sprite.looks = looks;
    assert.ok(sprite._looks[0].id === looks[0].id && sprite._looks[1].id === looks[1].id, "looks setter");
    assert.ok(sprite._looks[0] instanceof PocketCode.Model.Look && sprite._looks[1] instanceof PocketCode.Model.Look, "looks setter: instances");
    assert.equal(sprite._currentLook.id, looks[0].id, "current look getter");

    var looks = sprite.looks;
    var lookInstances = true;
    for (var i = 0, l = looks.lenth; i < l; i++) {
        if (!(looks[i] instanceof PocketCode.Model.Look)) {
            lookInstances = false;
            break;
        }
    }
    assert.ok(lookInstances, "looks getter: returns PocketCode.Model.Look objects");

    assert.equal(sprite.size, 100, "size (percentage) initial");
    assert.equal(sprite.visible, true, "visibility initial");
    assert.equal(sprite.transparency, 0, "transparency initial");
    assert.equal(sprite.brightness, 100, "brighness initial");
    assert.equal(sprite.colorEffect, 0, "colorEffect initial");

    //events
    assert.ok(sprite._onChange instanceof SmartJs.Event.Event, "event: onChange accessor and instance");
    assert.equal(sprite._onChange, gameEngine.onSpriteUiChange, "program - sprite event sharing");
    assert.equal(sprite._onChange.target, gameEngine, "onSpriteUiChange target check");

    assert.ok(sprite.onExecuted === sprite._onExecuted && sprite.onExecuted instanceof SmartJs.Event.Event, "event: onExecuted accessor and instance");

    var props = { direction: 90 };
    var prog2 = new PocketCode.GameEngine();
    var evSprite = new PocketCode.Model.Sprite(prog2, scene, { id: "newId", name: "myName" });
    var onChangeHandler = function (e) {
        assert.equal(e.target, evSprite, "onChange target check");
        assert.equal(e.id, "newId", " onChange id check");
        assert.deepEqual(e.properties, props, "onChange event args properties check");
        evSprite._onChange.removeEventListener(new SmartJs.Event.EventListener(onChangeHandler, this));
        prog2.dispose();    //make sure the gameEngine gets disposed to avoid side-effects with other tests
    };
    evSprite._onChange.addEventListener(new SmartJs.Event.EventListener(onChangeHandler, this));

    evSprite._triggerOnChange(props);


    sprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    var returnVal;

    // ********************* show/hide *********************
    returnVal = sprite.show();
    assert.ok(sprite._visible, "show sprite");
    assert.ok(!returnVal, "call show() on visisble sprite: return value");
    returnVal = sprite.hide();
    assert.ok(!sprite._visible, "show sprite");
    assert.ok(returnVal, "call hide() on invisisble sprite: return value");
    assert.ok(lastOnChangeArgs.visible !== undefined, "visibility event args");
    sprite.hide();
    sprite.show();
    assert.ok(sprite._visible, "show sprite");

    // ********************* GraphicEffects *********************
    assert.notOk(sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, "asdf"), "invalid brightness value: ignored");
    assert.throws(function () { sprite.setGraphicEffect(null, 50) }, Error, "unknown graphic effect");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 210);
    assert.equal(sprite.brightness, 200, "set brightness over 200");
    sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, -210);
    assert.equal(sprite.brightness, 0, "set brightness under 0");

    returnVal = sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 110);
    assert.equal(sprite.transparency, 100.0, "set transparency over 100");
    assert.ok(returnVal, "update: transparency");
    returnVal = sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 110);
    assert.ok(!returnVal, "update: transparency: not changed");
    sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, -110);
    assert.equal(sprite.transparency, 0.0, "set transparency under 0");

    returnVal = sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, 410);
    assert.equal(sprite.colorEffect, 10.0, "set colorEffect % 200");
    assert.ok(returnVal, "update: colorEffect");
    returnVal = sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, 610);
    assert.ok(!returnVal, "update: colorEffect: not changed");
    sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, -110);
    assert.equal(sprite.colorEffect, 90.0, "set colorEffect under 0");

    assert.notOk(sprite.changeGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, "asdf"), "invalid brightness value: ignored");
    assert.throws(function () { sprite.changeGraphicEffect(null, 50) }, Error, "ERROR: unknown graphic effect");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 100);
    assert.ok(!sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 100), "set grafic effect: no change to brightness");
    assert.notOk(sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS), "set grafic effect: missing argument brightness (ignored)");

    sprite.changeGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 110);
    assert.equal(sprite.brightness, 200, "change brightness over 200");
    sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 100);
    sprite.changeGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, -110);
    assert.equal(sprite.brightness, 0, "change brightness under 0");
    returnVal = sprite.changeGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, -110);
    assert.ok(!returnVal, "set brightness: no update on value");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 50);
    assert.equal(sprite.brightness, 50.0, "set brightness");
    sprite.changeGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 60);
    assert.equal(sprite.brightness, 110, "change brightness");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 50);
    assert.ok(!sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 50), "set grafic effect: no change to transparency");
    assert.throws(function () { sprite.setGraphicEffect("UNKNOWN", 50); }, Error, "ERROR: set grafic effect: unknown effect");
    assert.notOk(sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST), "set grafic effect: missing argument transparency (ignored)");

    sprite.changeGraphicEffect(PocketCode.GraphicEffect.GHOST, 60);
    assert.equal(sprite.transparency, 100.0, "change transparency over 100");
    sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 50);
    returnVal = sprite.changeGraphicEffect(PocketCode.GraphicEffect.GHOST, -60);
    assert.equal(sprite.transparency, 0.0, "change transparency under 0");
    assert.ok(returnVal, "change transparency: return value");
    returnVal = sprite.changeGraphicEffect(PocketCode.GraphicEffect.GHOST, -60);
    assert.ok(!returnVal, "change transparency: return value (no change)");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 50);
    assert.equal(sprite.transparency, 50.0, "set transparency");
    sprite.changeGraphicEffect(PocketCode.GraphicEffect.GHOST, 10);
    assert.equal(sprite.transparency, 60.0, "change transparency");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, 50);
    sprite.changeGraphicEffect(PocketCode.GraphicEffect.COLOR, 160);
    assert.equal(sprite.colorEffect, 10.0, "change colorEffect over 200");
    sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, 50);
    returnVal = sprite.changeGraphicEffect(PocketCode.GraphicEffect.COLOR, -60);
    assert.equal(sprite.colorEffect, 190.0, "change colorEffect under 0");
    assert.ok(returnVal, "change colorEffect: return value");
    returnVal = sprite.changeGraphicEffect(PocketCode.GraphicEffect.COLOR, -200);
    assert.ok(!returnVal, "change colorEffect: return value (no change)");

    sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, 50);
    assert.equal(sprite.colorEffect, 50.0, "set colorEffect");
    sprite.changeGraphicEffect(PocketCode.GraphicEffect.COLOR, 10);
    assert.equal(sprite.colorEffect, 60.0, "change colorEffect");

    returnVal = sprite.setGraphicEffect(PocketCode.GraphicEffect.FISHEYE, 50);
    assert.ok(!returnVal, "setting an undefined effect");
    returnVal = sprite.changeGraphicEffect(PocketCode.GraphicEffect.MOSAIC, 60);
    assert.ok(!returnVal, "changing an undefined effect");

    returnVal = sprite.clearGraphicEffects();
    assert.ok(sprite.brightness == 100 && sprite.transparency == 0 && sprite.colorEffect == 0, "graphic effects cleared");
    assert.ok(returnVal, "clear graphic effect: return value");
    returnVal = sprite.clearGraphicEffects();
    assert.ok(!returnVal, "clear graphic effect: return value (no updates)");

    // ********************* sound interface *********************
    var audioPlayer = sprite._audioPlayer;
    assert.equal(audioPlayer.volume, 100, "default volume set to 100");
    audioPlayer.volume = 50;
    assert.equal(audioPlayer.volume, 50, "volume getter/setter");

    assert.ok(typeof audioPlayer.loadSoundFile == 'function' &&
        typeof audioPlayer.startSound == 'function' &&
        typeof audioPlayer.stopSound == 'function' &&
        typeof audioPlayer.stopAllSounds == 'function', "audio Player interface check");

    var success = sprite.loadSoundFile("id", "url");
    assert.ok(typeof success == 'boolean', "loadSoundFile() returns status");

    success = sprite.startSound("id");
    assert.ok(typeof success == 'boolean', "startSound() returns status");
    try {
        sprite.stopSound("id");
        sprite.stopAllSounds();
        assert.ok(true, "audio inface call");
    }
    catch(e) {
        assert.ok(false, "audio inface call");
    }
    //detailed tests in bricks and player

    // ********************* Constructor *********************

    var device = new PocketCode.MediaDevice();
    gameEngine._brickFactory = new PocketCode.BrickFactory(device, scene, gameEngine._broadcastMgr, 20);

    var jsonProject = JSON.parse(JSON.stringify(projectSounds));
    var jsonSprite = jsonProject.sprites[0];
    jsonSprite.sounds = jsonProject.sounds;
    jsonSprite.variables = strProject11.variables;

    var testSprite = new PocketCode.Model.Sprite(gameEngine, scene, jsonSprite);

    assert.deepEqual(testSprite.id, jsonSprite.id, "Id set correctly");
    assert.deepEqual(testSprite.name, jsonSprite.name, "Name set correctly");

    var varsMatch = true;
    for (var i = 0, length = jsonSprite.variables.length; i < length; i++) {
        //if (!testSprite.__variablesSimple._variables[jsonSprite.variables[i].id] === jsonSprite.variables[i].id)
        if (testSprite.getVariable(jsonSprite.variables[i].id)._id !== jsonSprite.variables[i].id)
            varsMatch = false;
    }
    assert.ok(varsMatch, "Variables set correctly");

    //var soundsMatch = true;
    //for (var i = 0, length = jsonSprite.sounds.length; i < length; i++) {
    //    if (!testSprite._sounds[jsonSprite.sounds[i].id])
    //        soundsMatch = false;
    //}
    //assert.ok(soundsMatch, "Sounds set correctly");
    assert.equal(testSprite.sounds, jsonSprite.sounds, "Sounds set correctly");

    // ********************* isBackground/pen *********************
    var testBackgroundSprite = new PocketCode.Model.BackgroundSprite(gameEngine, scene, jsonSprite);

    //isBackground Tests
    testBackgroundSprite.isBackground = false;
    assert.equal(testBackgroundSprite.isBackground, false, "renderingSprite: isBackground set correctly");
    testBackgroundSprite.isBackground = true;
    assert.equal(testBackgroundSprite.isBackground, true, "renderingSprite: isBackground set correctly");

    //penDown Test
    assert.equal(testSprite._penDown, false, "renderingSprite: penDown is false");
    testSprite.penDown = false;
    assert.equal(testSprite._penDown, false, "renderingSprite: penDown is false (nothing changed)");
    testSprite.penDown = true;
    assert.equal(testSprite._penDown, true, "renderingSprite: penDown is true");

    //penSize Test
    testSprite.penSize = 4;
    assert.equal(testSprite._penSize, 4, "renderingSprite: penSize is 4");
    testSprite.penSize = 8;
    assert.equal(testSprite._penSize, 8, "renderingSprite: penSize is 8");

    //penColor Test
    var actualPenColor = testSprite._penColor;
    var expectedPenColor = testSprite._penColor;

    var rgbObject = { r: 0, g: 0, b: 255 };
    testSprite.penColor = rgbObject;
    assert.equal(actualPenColor, testSprite._penColor, "penColor not changed");

    rgbObject = { r: 25, g: 25, b: 25 };
    testSprite.penColor = rgbObject;
    assert.notEqual(actualPenColor, testSprite._penColor, "renderingSprite: penColor set correctly");
    assert.ok(testSprite._penColor.r === 25 &&
        testSprite._penColor.g === 25 &&
        testSprite._penColor.b === 25,
        "penColor (r, g, b) set correctly 2");

    assert.throws(function () { testSprite.penColor = 25 }, Error, "ERROR: invalid argument on penColor");

    assert.equal(actualPenColor, expectedPenColor, "renderingSprite: penColor is blue");
    actualPenColor.b = 0;
    actualPenColor.r = 255;
    expectedPenColor.b = 0;
    expectedPenColor.r = 255;
    assert.equal(actualPenColor, expectedPenColor, "renderingSprite: penColor is red");
    actualPenColor.r = 0;
    actualPenColor.g = 255;
    expectedPenColor.r = 0;
    expectedPenColor.g = 255;
    assert.equal(actualPenColor, expectedPenColor, "renderingSprite: penColor is green");

    // *************************************************************


    // programExecAsync();
    //testsExecAsync();
    //finalAsyncCall();

    var bricksMatch = true;
    for (var i = 0, length = jsonSprite.scripts.length; i < length; i++) {
        if (testSprite._scripts[i].id !== jsonSprite.scripts[i].id)
            bricksMatch = false;
    }
    assert.ok(bricksMatch, "Bricks set correctly");

    var looksMatch = true;
    for (var i = 0, length = jsonSprite.looks.length; i < length; i++) {
        if (testSprite._looks[i].id !== jsonSprite.looks[i].id)
            looksMatch = false;
    }
    assert.ok(looksMatch, "Looks set correctly");

    //mock _currentLook
    var look = new PocketCode.Model.Look({ id: "s1", resourceId: "img1", name: "testLook" });
    look._canvas = document.createElement("canvas");    //we have to set this to make sure a renderingSprite returns this properties
    testSprite._currentLook = look;
    assert.equal(testSprite.currentLook, look, "current look getter");

    testSprite._flipX = false;
    var lookOffsetX = 1;
    var lookOffsetY = 2;
    testSprite._lookOffsetX = lookOffsetX;
    testSprite._lookOffsetY = lookOffsetY;

    var renderingVar = testSprite.renderingVariables;
    assert.ok(renderingVar instanceof Array, "renderingVariables getter");

    var renderingSprite = testSprite.renderingSprite;

    assert.strictEqual(renderingSprite.id, testSprite.id, "renderingSprite: id set correctly");
    assert.strictEqual(renderingSprite.x, testSprite._positionY + lookOffsetX, "renderingSprite: x set correctly");
    assert.strictEqual(renderingSprite.y, testSprite._positionY + lookOffsetY, "renderingSprite: y set correctly");
    assert.strictEqual(renderingSprite.rotation, testSprite._direction - 90, "renderingSprite: rotation set correctly");
    assert.strictEqual(renderingSprite.flipX, testSprite._flipX, "renderingSprite: flipX set correctly");
    assert.strictEqual(renderingSprite.scaling, testSprite.size / 100.0, "renderingSprite: scaling set correctly");
    assert.strictEqual(renderingSprite.visible, testSprite._visible, "renderingSprite: visible set correctly");
    assert.equal(renderingSprite._originalCanvas, look.canvas, "renderingSprite: look set correctly");
    //^^ the look setter sets the original look, the getter returns the cached look including filters



    var graphicEffectsSet = renderingSprite._graphicEffects && renderingSprite._graphicEffects instanceof Array;
    assert.ok(graphicEffectsSet, "renderingSprite: graphicEffects created as array");
    if (graphicEffectsSet) {
        var ghostSet = 0;
        var brightnessSet = 0;
        var colorSet = 0;
        for (var i = 0, l = renderingSprite._graphicEffects.length; i < l; i++) {
            if (renderingSprite._graphicEffects[i].effect === PocketCode.GraphicEffect.GHOST) {
                ghostSet++;
                assert.equal(renderingSprite._graphicEffects[i].value, testSprite.transparency, "renderingSprite: ghost set correctly");
            }
            else if (renderingSprite._graphicEffects[i].effect === PocketCode.GraphicEffect.BRIGHTNESS) {
                brightnessSet++;
                assert.equal(renderingSprite._graphicEffects[i].value, testSprite.brightness - 100, "renderingSprite: brightness set correctly");
            }
            else if (renderingSprite._graphicEffects[i].effect === PocketCode.GraphicEffect.COLOR) {
                colorSet++;
                assert.equal(renderingSprite._graphicEffects[i].value, testSprite._colorEffect, "renderingSprite: colorEffect set correctly");
            }
        }
    }

    testSprite._currentLook = null;
    testSprite._recalculateLookOffsets();   //resetting looks (=private) for tests include calling this calculation update method to ensure internal offsets are reset as well

    renderingSprite = testSprite.renderingSprite;
    assert.strictEqual(renderingSprite.x, testSprite.positionX, "renderingSprite: x set correctly without currentLook");
    assert.strictEqual(renderingSprite.y, testSprite.positionY, "renderingSprite: y set correctly without currentLook");
    assert.strictEqual(renderingSprite.scaling, 1, "renderingSprite: scaling set correctly without currentLook");
    assert.ok(renderingSprite.look == undefined, "renderingSprite: no look set if there is no current look");

    var rotationStyle = "someRotationStyle";
    testSprite._rotationStyle = rotationStyle;
    assert.strictEqual(testSprite.rotationStyle, rotationStyle, "rotationStyle getter works as expected");

    var corruptSprite = JSON.parse(JSON.stringify(projectSounds.sprites[0]));
    corruptSprite.scripts = {};
    assert.throws(function () { new PocketCode.Model.Sprite(gameEngine, scene, corruptSprite); }, Error, "Error: incorrect argument for bricks.");

    corruptSprite = JSON.parse(JSON.stringify(projectSounds.sprites[0]));
    corruptSprite.sounds = {};
    assert.throws(function () { new PocketCode.Model.Sprite(gameEngine, scene, corruptSprite); }, Error, "Error: incorrect argument for sounds.");

    corruptSprite = JSON.parse(JSON.stringify(projectSounds.sprites[0]));
    corruptSprite.variables = {};
    assert.throws(function () { new PocketCode.Model.Sprite(gameEngine, scene, corruptSprite); }, Error, "Error: incorrect argument for variables.");

    corruptSprite = JSON.parse(JSON.stringify(projectSounds.sprites[0]));
    corruptSprite.looks = {};
    assert.throws(function () { new PocketCode.Model.Sprite(gameEngine, scene, corruptSprite); }, Error, "Error: incorrect argument for looks.");


    // *************************************************************

    // ********************* Size *********************
    assert.throws(function () { sprite.setSize("asdf") }, Error, "invalid percentage");

    sprite.setSize(0);
    assert.ok(!sprite.setSize(-20), "size not changed: 0");
    sprite.setSize(100);
    assert.ok(!sprite.setSize(100), "size not changed: same size");
    sprite.setSize(-20);
    assert.equal(sprite.size, 0, "set size below 0");
    returnVal = sprite.setSize(50);
    assert.equal(sprite.size, 50, "set size");
    assert.ok(returnVal, "set size return val");
    assert.ok(lastOnChangeArgs.scaling !== undefined, "set size event args");

    returnVal = sprite.changeSize(-60);
    assert.equal(sprite.size, 0, "change size below 0");
    assert.ok(returnVal, "change size: changed");
    assert.ok(lastOnChangeArgs.scaling !== undefined, "change size event args");

    sprite.changeSize(20);
    assert.equal(sprite.size, 20, "change size upwards");
    sprite.changeSize(15);
    sprite.changeSize(20);
    assert.equal(Math.round(sprite.size * 100) / 100, 55, "double change size");
    assert.throws(function () { sprite.changeSize(); }, Error, "ERROR: missing argument");
    lastOnChangeArgs = undefined;
    returnVal = sprite.changeSize(0);
    assert.ok(!returnVal, "change size: not changed");
    assert.ok(lastOnChangeArgs == undefined, "change size: no event dispatched");

    // *************************************************************

    // ********************* Position *********************
    assert.throws(function () { sprite.setPosition("s10", 10); }, Error, "ERROR: setPosition invalid args");
    returnVal = sprite.setPosition(5, 5, false);
    assert.notOk(returnVal, "returns fails if triggerEvent is set to false");

    returnVal = sprite.setPosition(10, 10);
    assert.ok(sprite._positionX == 10 && sprite._positionY == 10, "set Position");
    assert.ok(returnVal, "set position: update");
    assert.ok(lastOnChangeArgs.x !== undefined || lastOnChangeArgs.y !== undefined, "set position event args");
    returnVal = sprite.setPosition(10, 10);
    assert.ok(returnVal == false, "set position: no change");

    assert.throws(function () { sprite.setPositionY("s90"); }, Error, "ERROR: setPositionY invalid args");
    returnVal = sprite.setPositionY(90);
    assert.ok(sprite._positionX == 10 && sprite._positionY == 90, "set PositionY");
    assert.ok(returnVal, "set positionY: update");
    assert.ok(lastOnChangeArgs.y !== undefined, "set positionY event args");
    returnVal = sprite.setPositionY(90);
    assert.ok(returnVal == false, "set positionY: no change");

    assert.throws(function () { sprite.setPositionX("s35"); }, Error, "ERROR: setPositionX invalid args");
    returnVal = sprite.setPositionX(35);
    assert.ok(sprite._positionX == 35 && sprite._positionY == 90, "set PositionX");
    assert.ok(returnVal, "set positionX: update");
    assert.ok(lastOnChangeArgs.x !== undefined, "set positionX event args");
    returnVal = sprite.setPositionX(35);
    assert.ok(returnVal == false, "set positionX: no change");

    assert.throws(function () { sprite.changePositionX("s35"); }, Error, "ERROR: setPositionX invalid args");
    returnVal = sprite.changePositionX(50);
    assert.ok(sprite._positionX == 35 + 50 && sprite._positionY == 90, "change PositionX");
    assert.ok(returnVal, "change positionX: change");
    assert.ok(lastOnChangeArgs.x !== undefined, "chagne positionX event args");
    assert.ok(sprite.changePositionX(0) == false, "change positionX: no change");

    assert.throws(function () { sprite.changePositionY("s-20"); }, Error, "ERROR: setPositionY invalid args");
    returnVal = sprite.changePositionY(-20);
    assert.ok(sprite._positionX == 35 + 50 && sprite._positionY == 90 - 20, "change PositionY");
    assert.ok(returnVal, "change positionY: change");
    assert.ok(lastOnChangeArgs.y !== undefined, "change positionY event args");
    assert.ok(sprite.changePositionY(0) == false, "change positionY: no change");
    // *************************************************************

    //if on edge, bounce
    //assert.ok(typeof gameEngine.ifSpriteOnEdgeBounce === "function", "sprite-program interface: if on edge bounce");
    //var ioeCalled = false;
    //gameEngine.ifSpriteOnEdgeBounce = function () {    //override to check call
    //    ioeCalled = true;
    //};
    //sprite.ifOnEdgeBounce();
    //assert.ok(ioeCalled, "if on edge bounce: call parent");

    // ********************* Move/Direction *********************
    sprite.setPosition(-10, -10);
    returnVal = sprite.move(25);
    assert.ok(sprite._positionX == 15 && sprite._positionY == -10 && sprite._direction == 90, "move steps 90°");
    assert.ok(returnVal, "move return value: true on change");
    assert.ok(lastOnChangeArgs.x !== undefined || lastOnChangeArgs.y !== undefined, "move event args");
    assert.ok(sprite.move(0) == false, "move return value: false if position did not change");

    var triggerEvent;   //undefined = true
    sprite.setDirection(0);
    returnVal = sprite.setDirection(-90, triggerEvent);
    assert.ok(returnVal, "setDirection return value");
    assert.ok(lastOnChangeArgs.rotation !== undefined, "set direction event args");
    returnVal = sprite.setDirection(-90, triggerEvent);
    assert.ok(!returnVal, "setDirection return value false (no change)");
    assert.ok(sprite.setDirection() == false, "setDirection return value false (no parameter)");
    sprite.setPosition(-10, -10);
    sprite.move(25);
    assert.ok(sprite.positionX == -35 && Math.round(sprite.positionY) == -10 && sprite._direction == -90, "move steps -90°");

    sprite.setDirection(-180, triggerEvent);
    sprite.setPosition(-10, -10);
    sprite.move(25);
    assert.ok(Math.round(sprite.positionX) == -10 && sprite.positionY == -35 && sprite._direction == 180, "move steps -180°");

    sprite.setDirection(180, triggerEvent);
    sprite.setPosition(-10, -10);
    sprite.move(25);
    assert.ok(Math.round(sprite.positionX) == -10 && sprite.positionY == -35 && sprite._direction == 180, "move steps 180°");

    sprite.setDirection(0, triggerEvent);
    sprite.setPosition(-10, -10);
    sprite.move(25);
    assert.ok(Math.round(sprite.positionX) == -10 && sprite.positionY == 15 && sprite._direction == 0, "move steps 0°");

    triggerEvent = false;
    returnVal = sprite.setDirection(-90, triggerEvent);
    assert.ok(returnVal, "setDirection return value = true even if events are suppressed");

    // *************************************************************

    // ********************* turn *********************

    sprite.setDirection(90, triggerEvent);
    sprite.rotate(50);
    assert.equal(sprite._direction, 140, "turn right 50°");
    sprite.rotate(570); //710 --> -10
    assert.equal(sprite._direction, -10, "turn right to 710°");
    sprite.rotate(-180); // -190 --> 170
    assert.equal(sprite._direction, 170, "turn right to -190°");

    sprite.setDirection(90, triggerEvent);
    sprite.rotate(100); //190 --> -170
    assert.equal(sprite._direction, -170, "turn right to 190°");
    returnVal = sprite.rotate(180); //-170 --> 10
    assert.ok(returnVal, "turnRight returns true on update");
    assert.ok(lastOnChangeArgs.rotation !== undefined, "turn right event args");
    returnVal = sprite.rotate(0); //-170 --> 10
    assert.ok(!returnVal, "turnRight returns false: no update");
    returnVal = sprite.rotate(360);
    assert.ok(!returnVal, "turnRight returns false: no update (360°) turn");
    assert.ok(sprite.rotate() == false, "turn right without parameter");

    assert.equal(sprite._direction, 10, "turn right to 10°");
    sprite.rotate(-20); //-170 --> 10
    assert.equal(sprite._direction, -10, "turn right to 10°");
    sprite.setDirection(90, triggerEvent);
    sprite.rotate(-100); //-10 --> -10
    assert.equal(sprite._direction, -10, "turn right to -10°");

    sprite.setDirection(0, triggerEvent);
    sprite.rotate(-350); //-350 --> 10
    assert.equal(sprite._direction, 10, "turn right to 10°");
    sprite.setDirection(0, triggerEvent);
    sprite.rotate(350); //350 --> -10
    assert.equal(sprite._direction, -10, "turn right to -10°");
    sprite.setDirection(0, triggerEvent);
    returnVal = sprite.rotate(-350); //350 --> 10
    assert.ok(returnVal, "turnLeft returns true on update");
    returnVal = sprite.rotate(-360);
    assert.ok(!returnVal, "turnLeft returns false: no update (360°) turn");
    assert.ok(sprite.rotate() == false, "turn left without parameter");

    assert.equal(sprite._direction, 10, "turn left to 10°");
    sprite.setDirection(0, triggerEvent);
    sprite.rotate(350); //-350 --> -10
    assert.equal(sprite._direction, -10, "turn left to -10°");

    sprite.setDirection(90, triggerEvent);
    sprite.rotate(-540); //-350 --> 10
    assert.ok(sprite._direction == -90, "turn right to -90°");
    sprite.setDirection(90, triggerEvent);
    sprite.rotate(541); //350 --> -10
    assert.ok(sprite._direction == -89, "turn right to -89°");
    sprite.setDirection(90, triggerEvent);
    sprite.rotate(-540); //350 --> 10
    assert.ok(sprite._direction == -90, "turn left to -90°");
    sprite.setDirection(90, triggerEvent);
    sprite.rotate(541); //-350 --> -10
    assert.equal(sprite._direction, -89, "turn left to -89°");

    sprite.setDirection(-90, triggerEvent);
    sprite.rotate(-450); //-350 --> 10
    assert.equal(sprite._direction, 180, "turn right to 180°");
    sprite.setDirection(-90, triggerEvent);
    sprite.rotate(450); //350 --> -10
    assert.equal(sprite._direction, 0, "turn right to 0°");
    sprite.setDirection(-90, triggerEvent);
    sprite.rotate(-450); //350 --> 10
    assert.equal(sprite._direction, 180, "turn left to 180°");
    assert.ok(lastOnChangeArgs.rotation !== undefined, "turn left event args");
    sprite.setDirection(-90, triggerEvent);
    sprite.rotate(450); //-350 --> -10
    assert.equal(sprite._direction, 0, "turn left to 0°");

    // ********************* variables *********************
    //are part of userVariableHost tests

    // ********************* looks *********************
    sprite.looks = [];
    returnVal = sprite.setLook("non existing");
    assert.ok(!returnVal, "set look on nonexisting look");

    var look1 = { name: "look1", id: "first", resourceId: "1" };    //new PocketCode.Model.Look({ name: "look1", id: "first", resourceId: "1" });//new Object();
    //look1._center = { length: 0.0, angle: 0.0 };
    //look1._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args

    var look2 = { name: "look2", id: "second", resourceId: "2" };   //new PocketCode.Model.Look({ name: "look2", id: "second", resourceId: "2" });//new Object();
    //look2._center = { length: 0.0, angle: 0.0 };

    var looks = [];
    looks[0] = look1;
    looks[1] = look2;

    assert.equal(sprite.currentLookNumber, "1", "currentLookNumber getter (currentLook undefined: return 1 as index)");
    assert.equal(sprite.currentLookName, "", "currentLookName getter (currentLook undefined");

    sprite.looks = looks;

    assert.equal(sprite.currentLookNumber, "1", "currentLookNumber getter");
    assert.equal(sprite.currentLookName, "look1", "currentLookName getter");

    //apply center to internal looks to run these tests
    sprite._looks[0]._center = { length: 0, angle: 0 };
    sprite._looks[0]._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args
    sprite._looks[1]._center = { length: 0, angle: 0 };
    sprite._looks[1]._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args

    assert.ok(sprite._looks[0].id === looks[0].id && sprite._looks[1].id === looks[1].id, "looks setter");
    assert.equal(sprite._looks[1].name, "look2", "set looks1");
    assert.equal(sprite._currentLook.id, "first", "set looks2");
    assert.equal(sprite._currentLook.name, "look1", "set looks3");

    returnVal = sprite.setLook("first");
    assert.ok(!returnVal, "set already active look: no change");

    //we do have to overide the gameEngine look equest to test this, as there are no looks registered
    //game engine: getLookImage
    assert.ok(typeof gameEngine.getLookImage === "function", "sprite-program interface: get look from store");
    //gameEngine.getLookImage = function (id) {
    //    return { canvas: new Image(), center: { length: 0, angle: 0 }, initialScaling: 0.5 };
    //};
    returnVal = sprite.setLook("second");
    assert.ok(sprite._currentLook.name == "look2", "set current look with id");
    assert.ok(returnVal, "set look: change (return value)");
    assert.ok(lastOnChangeArgs.look !== undefined, "set look event args");
    assert.throws(function () { sprite.setLook("non existing"); }, "ERROR: try to set undefined look");

    sprite.looks = [];
    returnVal = sprite.nextLook();
    assert.ok(!returnVal, "next look on nonexisting look");

    sprite.looks = looks;
    //apply center to internal looks to run these tests
    sprite._looks[0]._center = { length: 0, angle: 0 };
    sprite._looks[0]._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args
    sprite._looks[1]._center = { length: 0, angle: 0 };
    sprite._looks[1]._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args

    returnVal = sprite.setLook("second");
    returnVal = sprite.nextLook();
    assert.ok(sprite._currentLook.name == "look1", "next look");
    assert.ok(returnVal, "first look is set after last");
    assert.ok(lastOnChangeArgs.look !== undefined, "next look event args");
    returnVal = sprite.nextLook();
    assert.ok(sprite._currentLook.name == "look2", "next look 2");
    assert.ok(returnVal, "next look is set correctly");

    assert.equal(sprite.currentLookNumber, "2", "currentLookNumber getter 2");
    assert.equal(sprite.currentLookName, "look2", "currentLookName getter 2");

    sprite._looks.pop();    //only one left
    returnVal = sprite.nextLook();
    assert.ok(!returnVal, "next look if only one is defined");

    //previous
    sprite.looks = [];
    returnVal = sprite.previousLook();
    assert.ok(!returnVal, "previous look on nonexisting look");

    sprite.looks = looks;
    //apply center to internal looks to run these tests
    sprite._looks[0]._center = { length: 0, angle: 0 };
    sprite._looks[0]._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args
    sprite._looks[1]._center = { length: 0, angle: 0 };
    sprite._looks[1]._canvas = "canvas";    //we have to set this as this property will be returned as look in the event args

    returnVal = sprite.setLook("second");
    returnVal = sprite.previousLook();
    assert.ok(sprite._currentLook.name == "look1", "previous look");
    assert.ok(returnVal, "last look is set after first");
    assert.ok(lastOnChangeArgs.look !== undefined, "previous look event args");
    returnVal = sprite.previousLook();
    assert.ok(sprite._currentLook.name == "look2", "previous look 2");
    assert.ok(returnVal, "previous look is set correctly");

    sprite._looks.pop();    //only one left
    returnVal = sprite.previousLook();
    assert.ok(!returnVal, "previous look if only one is defined");

    looks[1] = look2;   //add again
    var look3 = { name: "look3", id: "third", resourceId: "s3" };
    looks[2] = look3;
    sprite.looks = looks;
    //apply center to internal looks to run these tests
    //sprite._looks[0].center = { length: 0, angle: 0 };
    //sprite._looks[1].center = { length: 0, angle: 0 };
    //sprite._looks[2].center = { length: 0, angle: 0 };

    assert.ok(sprite._currentLook.name == "look1", "current look set back to first after look setter");
    assert.equal(sprite._looks.length, 3, "looks count increased");

    sprite.setLook("third");
    assert.ok(sprite._currentLook.name == "look3", "next look to last look");

    sprite.nextLook();
    assert.ok(sprite._currentLook.name == "look1", "look loop 1");
    sprite.nextLook();
    assert.ok(sprite._currentLook.name == "look2", "look loop 2");
    sprite.nextLook();
    assert.ok(sprite._currentLook.name == "look3", "look loop 3");
    sprite.nextLook();
    assert.ok(sprite._currentLook.name == "look1", "look loop 4 back to first");

    // *************************************************************

    // ********************* start/pause/resume/stop *********************
    //var device = new PocketCode.MediaDevice();
    var programAsync = new PocketCode.GameEngine();
    scene = new PocketCode.Model.Scene(gameEngine, undefined, []);
    programAsync._executionState = PocketCode.ExecutionState.RUNNING;
    programAsync.getLookImage = function (id) { //override to test look center 
        return { canvas: undefined, center: { length: 0, angle: 0 }, initialScaling: 1 };
    };

    var brick1 = new PocketCode.Model.WhenProgramStartBrick(device, sprite, { x: 1, y: 2 }, scene.onStart);
    brick1._id = "first";
    var brick2 = new PocketCode.Model.WhenProgramStartBrick(device, sprite, { x: 1, y: 2 }, scene.onStart);
    brick2._id = "second";
    //adding a test brick to the internal brick container
    var testBrick = new PocketCode.Model.WaitBrick(device, sprite, { duration: { type: "NUMBER", value: 0.2, right: null, left: null } });
    brick2._bricks._bricks.push(testBrick);
    var brick3 = new PocketCode.Model.WhenProgramStartBrick(device, sprite, { x: 1, y: 2 }, scene.onStart);
    brick3._id = "third";
    //var brick4 = new PocketCode.Model.WhenProgramStartBrick(device, sprite, { x: 1, y: 2 }, scene.onStart);
    //var brick5 = new PocketCode.Model.WhenProgramStartBrick(device, sprite, { x: 1, y: 2 }, scene.onStart);
    var tmpBricks = [];
    tmpBricks[0] = brick1;
    tmpBricks[1] = brick2;
    tmpBricks[2] = brick3;
    sprite.scripts = tmpBricks;
    assert.equal(sprite.scripts, tmpBricks, "bricks getter");
    assert.ok(sprite._scripts.length == 3, "bricks length");

    assert.notOk(sprite.scriptsOrSoundsExecuting, "scrips or sounds not running");

    //start, pause, resume, stop + executed
    //binding program events
    //for (var i = 0, l = tmpBricks.length; i < l; i++) { //TODO: rewrite test for scenes
    //    tmpBricks[i].onExecuted.addEventListener(new SmartJs.Event.EventListener(scene._spriteOnExecutedHandler, programAsync));
    //}

    //var programExecutedHandler = function () {
    //    assert.ok(true, "program executed: all running scripts executed");

    //    //remove after dispatched to avoid multiple calls
    //    for (var i = 0, l = tmpBricks.length; i < l; i++) {
    //        tmpBricks[i].onExecuted.removeEventListener(new SmartJs.Event.EventListener(scene._spriteOnExecutedHandler, programAsync));
    //    }
    //    programExecAsync();
    //    asyncCalls++;
    //    disposeTest();  //make sure this is called last
    //};
    //programAsync.onProgramExecuted.addEventListener(new SmartJs.Event.EventListener(programExecutedHandler, this));
    //scene.onStart.dispatchEvent();
    //assert.ok(sprite.scriptsOrSoundsExecuting, "scrips running: onExecute (program)");

    brick1._executionState = PocketCode.ExecutionState.RUNNING;  //simulate running
    brick2._executionState = PocketCode.ExecutionState.RUNNING;  //simulate running
    brick3._executionState = PocketCode.ExecutionState.RUNNING;  //simulate running

    //making sure the script was really paused is quite a hack here
    var isPaused = function () {
        var paused = true,
            scripts = sprite._scripts;
        for (var i = 0; i < scripts.length; i++) {
            if (!scripts[i]._paused) {
                paused = false;
                break;
            }
            return paused;
        }
    };

    sprite.pauseScripts();
    assert.ok(isPaused(), "all scripts paused");
    

    sprite.resumeScripts();
    assert.notOk(isPaused(), "all scripts resumed (not paused)");
    assert.ok(sprite.scriptsOrSoundsExecuting, "scrips running: running");

    //sprite.stopScript(true, "1");
    //assert.ok(sprite.scriptsOrSoundsExecuting, "scrips running: running (stopScript with non existing id)");

    //sprite.stopScript(true, "first");
    //assert.equal(sprite._scripts[0]._executionState, 0, "one script stopped");
    //assert.equal(sprite._scripts[1]._executionState, 1, "one script stopped, other still running");

    sprite.stopAllScripts(true);
    assert.ok(!sprite.scriptsOrSoundsExecuting, "scrips running: stopped");
    assert.ok(function () {
        for (var p in testBrick._pendingOps)
            if (testBrick._pendingOps.hasOwnProperty(p))
                return false;
        return true;
    }, "script stopped correctly: deep check: no threaded items left");

    //start script again to get an onExecEvent in the gameEngine
    programAsync._executionState = PocketCode.ExecutionState.RUNNING;
    scene.onStart.dispatchEvent();

    // ********************* come to front/go back *********************
    var gameEngine = new PocketCode.GameEngine();
    gameEngine.getLookImage = function (id) { //override to test look center 
        return { canvas: undefined, center: { length: 0, angle: 0 }, initialScaling: 1 };
    };

    var newSprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    scene._sprites.push(newSprite);
    var firstLayer = newSprite.layer;

    var newSprite2 = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    scene._sprites.push(newSprite2);

    var tmpsprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    scene._sprites.push(tmpsprite);

    newSprite.comeToFront();
    assert.ok(newSprite.layer == scene._sprites.length, "come to front 1");
    tmpsprite.comeToFront();
    assert.ok(tmpsprite.layer == scene._sprites.length, "come to front 2");
    newSprite2.comeToFront();
    assert.ok(newSprite2.layer == scene._sprites.length, "come to front 3");

    var layerBefore = newSprite.layer;
    newSprite.goBack(2);
    assert.ok(newSprite.layer == firstLayer, "go back 2 layers");
    layerBefore = newSprite2.layer;
    newSprite2.goBack(1);
    assert.ok(newSprite2.layer == layerBefore - 1, "go back 1 layers");
    layerBefore = tmpsprite.layer;
    tmpsprite.goBack(2);
    assert.ok(tmpsprite.layer == layerBefore - 2, "go back 2 layers");
    layerBefore = tmpsprite.layer;
    tmpsprite.goBack(3);
    assert.ok(tmpsprite.layer == firstLayer, "go back 3 layers");
    // *************************************************************

    // ********************* point to *********************
    sprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    sprite._id = "id1";
    scene._sprites.push(sprite);
    newSprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "newId", name: "myName" });
    newSprite._id = "id2";
    scene._sprites.push(newSprite);
    var tmp = scene.getSpriteById("id2");
    assert.ok(tmp === newSprite, "push sprite to program");

    newSprite.setPosition(100, 100);
    sprite.setPosition(50, 50);

    returnVal = sprite.setDirectionTo();
    assert.ok(!returnVal, "setDirectionTo: missing argument");
    returnVal = sprite.setDirectionTo("id2");
    assert.ok(sprite.direction == 45, "point to right up sprite");
    assert.ok(returnVal, "point to: value changed");
    assert.ok(lastOnChangeArgs.rotation !== undefined, "setDirectionTo event args");
    returnVal = sprite.setDirectionTo("id2");
    assert.ok(!returnVal, "point to: value not changed");
    //returnVal = sprite.setDirectionTo(sprite.id);
    //assert.ok(!returnVal, "point to: self (no change)");

    newSprite.setPosition(0, 0);
    sprite.setPosition(0, 0);
    returnVal = sprite.setDirectionTo("id2");
    assert.ok(!returnVal, "point to: sprite on same position: ignored");

    sprite.setPosition(50, 50);

    sprite.setDirectionTo("id2");
    assert.ok(sprite.direction == -180 + 45, "point to left down sprite");
    // *************************************************************

    testsExecAsync();
    asyncCalls++;

    sprite.drawStamp();
    assert.ok(lastOnChangeArgs.drawStamp === true, "Drawstamp set");

    //test methode clone
    var broadcastMgr = new PocketCode.BroadcastManager([{ id: "s12", name: "test" }]);
    var scene2 = new PocketCode.Model.Scene(gameEngine, device, []);
    var sprite2 = new PocketCode.Model.Sprite(gameEngine, scene2, { id: "2", name: "newName", scripts: tmpBricks });

    var brick4 = new PocketCode.Model.WhenProgramStartBrick(device, sprite2, { x: 1, y: 2 }, scene2.onStart);
    brick4._id = "first";
    var tmpBricks2 = [];
    tmpBricks2[0] = brick4;
    sprite2.scripts.push(tmpBricks2);

    sprite2.looks = looks;
    scene2._sprites.push(sprite2);

    sprite2.penDown = true;
    sprite2.penSize = 6;
    sprite2.setSize(40);
    sprite2.hide();

    var clone_sprite2 = sprite2.clone(device, broadcastMgr);
    assert.ok(clone_sprite2._penDown == sprite2._penDown &&
        clone_sprite2._penSize == sprite2._penSize &&
        clone_sprite2.size == sprite2.size &&
        clone_sprite2.visible == sprite2.visible, "set properties for clone correct");

    var brick1 = new PocketCode.Model.WhenProgramStartBrick(device, sprite, { x: 1, y: 2 }, scene.onStart);
    brick1._id = "first";
    var tmpBricks = [];
    tmpBricks[0] = brick1;
    sprite.scripts = tmpBricks;

    disposeTest();

});


QUnit.test("Sprite offsets", function (assert) {
    //assert.ok(false, "TODO");
    //return;
    //TODO:: refactoring, scenes + cntr arguments


    var testsDone = assert.async();

    var onLoadHandler = function () {
        var looks = [{ id: "s_1", resourceId: "s1", name: "look1" }, { id: "s_2", resourceId: "s2", name: "look2" }];
        var sprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "id", name: "sprite", looks: looks });
        sprite.initLooks();
        sprite.init();

        var rotationAngle = 180;
        sprite.setDirection(rotationAngle);
        assert.equal(sprite._lookOffsetX.toFixed(2), 3.0, "lookOffsetX calculated correctly after setting direction to 180 degrees");
        assert.equal(sprite._lookOffsetY.toFixed(2), 0.0, "lookOffsetY calculated correctly after setting direction to 180 degrees");

        var center, convertedAngle;
        for (rotationAngle = 0; rotationAngle <= 360; rotationAngle += 36) {
            sprite.setDirection(rotationAngle);
            center = sprite._currentLook.center;//is.getImage(sprite._currentLook.imageId).center;
            convertedAngle = (sprite._direction - 90.0) * Math.PI / 180.0;
            assert.equal(sprite._lookOffsetX.toFixed(2), (center.length * Math.cos(center.angle - convertedAngle)).toFixed(2), "lookOffsetX calculated correctly after setting direction to " + rotationAngle + " degrees");
            assert.equal(sprite._lookOffsetY.toFixed(2), (center.length * Math.sin(center.angle - convertedAngle)).toFixed(2), "lookOffsetY calculated correctly after setting direction to " + rotationAngle + " degrees");
        }
        sprite.setLook("s_2");
        center = sprite._currentLook.center;//is.getImage(sprite._currentLook.imageId).center;
        convertedAngle = (sprite._direction - 90.0) * Math.PI / 180.0;
        assert.equal(sprite._lookOffsetX.toFixed(2), (center.length * Math.cos(center.angle - convertedAngle)).toFixed(2), "lookOffsetX calculated correctly after look change");
        assert.equal(sprite._lookOffsetY.toFixed(2), (center.length * Math.sin(center.angle - convertedAngle)).toFixed(2), "lookOffsetY calculated correctly after look change");

        testsDone();
    };

    var is = new PocketCode.ImageStore(),
        baseUrl = "_resources/images/",
        images = [
            { id: "s1", url: "imgHelper17.png", size: 1 },
            { id: "s2", url: "imgHelper18.png", size: 1 }
        ];

    var gameEngine = new PocketCode.GameEngine();
    gameEngine._imageStore = is;
    var scene = new PocketCode.Model.Scene(gameEngine, undefined, []);

    is.onLoad.addEventListener(new SmartJs.Event.EventListener(onLoadHandler));
    is.loadImages(baseUrl, images, 1);

});


QUnit.test("Sprite: rotation style", function (assert) {
    //assert.ok(false, "TODO");
    //return;
    //TODO:: refactoring, scenes + cntr arguments


    //all sprite features are tested where rotation style has an impact: except ifOnEdgeBounce- there is another test routine for this feature
    var done = assert.async();

    var gameEngine = new PocketCode.GameEngine(),
        is = new PocketCode.ImageStore(),
        scene = new PocketCode.Model.Scene(gameEngine, undefined, []),
        baseUrl = "_resources/images/",
        images = [
            { id: "s1", url: "imgHelper17.png", size: 1 },
            { id: "s2", url: "imgHelper18.png", size: 1 }
        ];

    gameEngine._imageStore = is;    //inject image store
    var looks = [{ id: "s_1", resourceId: "s1", name: "look1" }, { id: "s_2", resourceId: "s2", name: "look2" }];
    var sprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "id", name: "sprite", looks: looks });

    //add event listener to verify triggered updates (UI)
    var props;
    var spriteOnChangeHandler = function (e) {
        props = e.properties;
    };
    sprite._onChange.addEventListener(new SmartJs.Event.EventListener(spriteOnChangeHandler));

    //start tests
    var onLoadHandler = function () {
        sprite.initLooks();
        sprite.init();

        //rotation style method and getter
        assert.equal(sprite.rotationStyle, PocketCode.RotationStyle.ALL_AROUND, "default ALL-AROUND after loading/init");

        assert.throws(function () { sprite.rotationStyle = PocketCode.RotationStyle.ALL_AROUND }, Error, "ERROR: no setter, use setRotationStyle() instead to get a return value");
        sprite.setDirection(45); //make sure changing the rotationStyle triggers a UI update
        var result = sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);
        assert.ok(result, "rotationStyle UI update triggered: return value");
        assert.equal(props.rotation, 0.0, "onChange event triggered- rotation = 0");
        assert.equal(sprite.rotationStyle, PocketCode.RotationStyle.LEFT_TO_RIGHT, "rotation style: getter/setter");

        result = sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);
        assert.notOk(result, "rotationStyle NOT changed");
        assert.throws(function () { sprite.setRotationStyle("invalid") }, Error, "ERROR: invalid argument/unknown rotation style");

        result = sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        assert.equal(props.rotation, -45.0, "rotation set if rotation style is set to ALL_AROUND");
        result = sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        assert.equal(props.rotation, 0.0, "rotation set if rotation style is set to DO_NOT_ROTATE");

        props = undefined;
        sprite._rotationStyle = PocketCode.RotationStyle.LEFT_TO_RIGHT;
        sprite._direction = -1.0;
        result = sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        assert.notOk(props.flipX, "turn back to flipX = false when switch to DO_NOT_ROTATE");
        props = undefined;

        sprite._rotationStyle = PocketCode.RotationStyle.LEFT_TO_RIGHT;
        sprite._direction = -1.0;
        result = sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        assert.ok(props.rotation == -91.0 && props.flipX == false, "turn back to flipX = false when switch to ALL_AROUND")


        //private method: _recalculateLookOffsets (we test this even it's private because this is a very importent method calculating rendering offsets due to look size != sprite size
        sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        var savedCurrentLook = sprite._currentLook;
        sprite._currentLook = undefined;
        sprite._recalculateLookOffsets();
        assert.ok(sprite._lookOffsetX == 0.0 && sprite._lookOffsetY == 0.0, "look offsets 0.0 if there is no look defined");

        sprite._currentLook = savedCurrentLook;
        sprite._direction = 90.0;   //make sure the sprite is not rotated
        sprite._recalculateLookOffsets();
        var ox = sprite._lookOffsetX,
            oy = sprite._lookOffsetY;
        assert.ok(ox != 0.0 && oy != 0.0, "offsets calculated for current look");

        sprite._direction = 45.0;   //rotate
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite._recalculateLookOffsets();
        assert.ok(ox == sprite._lookOffsetX && oy == sprite._lookOffsetY, "rotation style DO_NOT_ROTATE: offsets keep the same");
        sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);
        sprite._recalculateLookOffsets();
        assert.ok(ox == sprite._lookOffsetX && oy == sprite._lookOffsetY, "rotation style LEFT_TO_RIGHT: offsets keep the same");

        sprite._direction = -1.0;
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite._recalculateLookOffsets();
        assert.ok(ox == sprite._lookOffsetX && oy == sprite._lookOffsetY, "rotation style DO_NOT_ROTATE: offsets keep the same: direction = -1");
        sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);
        sprite._recalculateLookOffsets();
        assert.ok(ox == -sprite._lookOffsetX && oy == sprite._lookOffsetY, "rotation style LEFT_TO_RIGHT: offsetX fliped: direction = -1");

        //change direction
        props = undefined;
        sprite._rotationStyle = PocketCode.RotationStyle.ALL_AROUND;
        sprite._direction = 0.0;

        result = sprite.setDirection(-45.0);
        assert.ok(result, "direction changed: ALL_AROUND");
        assert.ok(props.rotation == -135 && props.flipX == undefined, "rotation update triggered");

        sprite._rotationStyle = PocketCode.RotationStyle.LEFT_TO_RIGHT;
        sprite._direction = 20.0;
        result = sprite.setDirection(-10.0);
        assert.ok(result, "direction changed: LEFT_TO_RIGHT");
        assert.ok(props.rotation === undefined && props.flipX === true, "flipX update triggered");
        props = undefined;
        result = sprite.setDirection(-15.0);
        assert.notOk(result, "no UI change because of rotation style: LEFT_TO_RIGHT");
        assert.deepEqual(props, undefined, "rotation update NOT triggered");
        props = undefined;
        result = sprite.setDirection(15.0);
        assert.ok(props.rotation === undefined && props.flipX === false, "rotation update triggered: flipX only, rotation not changed");

        props = undefined;
        sprite._rotationStyle = PocketCode.RotationStyle.DO_NOT_ROTATE;
        result = sprite.setDirection(-15.0);
        assert.deepEqual(props, undefined, "no UI change because of rotation style: DO_NOT_ROTATE");

        done();
    };

    //start loading
    is.onLoad.addEventListener(new SmartJs.Event.EventListener(onLoadHandler));
    is.loadImages(baseUrl, images, 1);

});


QUnit.test("Sprite: ifOnEdgeBounce", function (assert) {
    //assert.ok(false, "TODO");
    //return;
    //TODO:: refactoring, scenes + cntr arguments


    var done = assert.async();

    var gameEngine = new PocketCode.GameEngine(),
        is = new PocketCode.ImageStore(),
        scene = new PocketCode.Model.Scene(gameEngine, undefined, []),
        baseUrl = "_resources/images/",
        images = [
            { id: "i1", url: "imgHelper1.png", size: 1 },
            //{ id: "i2", url: "imgHelper2.png", size: 1 },
            //{ id: "i3", url: "imgHelper3.png", size: 1 },
            //{ id: "i4", url: "imgHelper4.png", size: 1 },
            //{ id: "i5", url: "imgHelper5.png", size: 1 },
            //{ id: "i6", url: "imgHelper6.png", size: 1 },
            //{ id: "i7", url: "imgHelper7.png", size: 1 },
            //{ id: "i8", url: "imgHelper8.png", size: 1 },
            { id: "i9", url: "imgHelper9.png", size: 1 },
            { id: "i10", url: "imgHelper10.png", size: 1 },
            { id: "i11", url: "imgHelper11.png", size: 1 },
        ];

    //simulate loading a json Project: setting required properties (internal)
    scene._originalScreenWidth = 50;
    scene._originalScreenHeight = 100;
    scene._collisionManager = new PocketCode.CollisionManager(scene._originalScreenWidth, scene._originalScreenHeight);

    var sh2 = scene._originalScreenHeight * 0.5,
        sw2 = scene._originalScreenWidth * 0.5;
    var is = new PocketCode.ImageStore();
    gameEngine._imageStore = is;    //inject image store

    var looks = [
        { id: "i_1", resourceId: "i1", name: "look1" },
        { id: "i_9", resourceId: "i9", name: "look9" },
        { id: "i_10", resourceId: "i10", name: "look10" },
        { id: "i_11", resourceId: "i11", name: "look11" },
    ];
    var sprite = new PocketCode.Model.Sprite(gameEngine, scene, { id: "spriteId_test", name: "sprite", looks: looks });

    //add event listener to verify triggered updates (UI)
    var lastUpdateEventArgs;
    var spriteOnChangeHandler = function (e) {
        lastUpdateEventArgs = e;
    };
    sprite._onChange.addEventListener(new SmartJs.Event.EventListener(spriteOnChangeHandler));
    //^^ equivalent gameEngine.onSpriteUiChange

    //start tests
    var onLoadHandler = function () {
        sprite.initLooks();
        sprite.init();

        startTest();
    };

    //start loading
    is.onLoad.addEventListener(new SmartJs.Event.EventListener(onLoadHandler));
    is.loadImages(baseUrl, images, 1);

    var opReturn, boundary;

    function startTest() {

        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(lastUpdateEventArgs, undefined, "simple: event: no change");
        assert.equal(sprite.ifOnEdgeBounce(), false, "simple: return value: no change");

        var currentLook = sprite._currentLook;
        sprite._currentLook = undefined;
        assert.notOk(sprite.ifOnEdgeBounce(), "return false if look not defined");
        sprite._currentLook = currentLook;

        //simple pixel tests without rotation (DO_NOT_ROTATE)
        var overflowTop, overflowRight, overflowBottom, overflowLeft;

        //top: direction not changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(0);
        sprite.setPositionY(54);
        sprite.setDirection(110);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "DO_NOT_ROTATE: top overflow (not 'in direction')");
        assert.ok(lastUpdateEventArgs.properties.x === undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: top overflow: event argument check (not 'in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowTop = sprite.positionY + boundary.top - sh2;
        assert.equal(overflowTop, 0, "DO_NOT_ROTATE: top overflow: aligned after bounce (not 'in direction')");
        assert.equal(sprite.direction, 110, "DO_NOT_ROTATE: top: direction not changed (not 'in direction')");
        assert.equal(sprite.positionX, 0, "DO_NOT_ROTATE: top without direction change: x pos does not change (not 'in direction')");

        sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        sprite.setPositionX(0);
        sprite.setPositionY(54);
        sprite.setDirection(90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, 90, "top overflow, direction parallel to edge (90): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "top overflow, direction parallel to edge (90): rotation not changed: event");
        sprite.setPositionX(0);
        sprite.setPositionY(54);
        sprite.setDirection(-90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, -90, "top overflow, direction parallel to edge (-90): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "top overflow, direction parallel to edge (-90): rotation not changed: event");

        //top: direction changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(0);
        sprite.setPositionY(54);
        sprite.setDirection(70);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(lastUpdateEventArgs.properties.x === undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: top overflow: event argument check ('in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowTop = sprite.positionY + boundary.top - sh2;
        assert.equal(overflowTop, 0, "DO_NOT_ROTATE: top overflow: aligned after bounce ('in direction')");
        assert.equal(sprite.direction, 110, "DO_NOT_ROTATE: top: direction changed ('in direction')");
        assert.equal(sprite.positionX, 0, "DO_NOT_ROTATE: top without direction change: x pos does not change ('in direction')");

        //right: direction not changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(23);
        sprite.setPositionY(0);
        sprite.setDirection(-80);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "DO_NOT_ROTATE: right overflow (not 'in direction')");
        assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y === undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: right overflow: event argument check (not 'in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowRight = sprite.positionX + boundary.right - sw2;
        assert.equal(overflowRight, 0, "DO_NOT_ROTATE: right overflow: aligned after bounce (not 'in direction')");
        assert.equal(sprite.direction, -80, "DO_NOT_ROTATE: right: direction not changed (not 'in direction')");
        assert.equal(sprite.positionY, 0, "DO_NOT_ROTATE: right without direction change: y pos does not change (not 'in direction')");

        sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        sprite.setPositionX(23);
        sprite.setPositionY(0);
        sprite.setDirection(0);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, 0, "right overflow, direction parallel to edge (0): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "right overflow, direction parallel to edge (0): rotation not changed: event");
        sprite.setPositionX(43);
        sprite.setPositionY(0);
        sprite.setDirection(180);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, 180, "right overflow, direction parallel to edge (180): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "right overflow, direction parallel to edge (180): rotation not changed: event");

        //right: direction changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(23);
        sprite.setPositionY(0);
        sprite.setDirection(80);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y === undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: right overflow: event argument check ('in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowRight = sprite.positionX + boundary.right - sw2;
        assert.equal(overflowRight, 0, "DO_NOT_ROTATE: right overflow: aligned after bounce ('in direction')");
        assert.equal(sprite.direction, -80, "DO_NOT_ROTATE: right: direction changed ('in direction')");
        assert.equal(sprite.positionY, 0, "DO_NOT_ROTATE: right without direction change: y pos does not change ('in direction')");

        //bottom: direction not changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(0);
        sprite.setPositionY(-47);
        sprite.setDirection(-40);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "DO_NOT_ROTATE: bottom overflow (not 'in direction')");
        assert.ok(lastUpdateEventArgs.properties.x === undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: bottom overflow: event argument check (not 'in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        assert.equal(overflowBottom, 0, "DO_NOT_ROTATE: bottom overflow: aligned after bounce (not 'in direction')");
        assert.equal(sprite.direction, -40, "DO_NOT_ROTATE: bottom: direction not changed (not 'in direction')");
        assert.equal(sprite.positionX, 0, "DO_NOT_ROTATE: bottom without direction change: x pos does not change (not 'in direction')");

        sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        sprite.setPositionX(0);
        sprite.setPositionY(-47);
        sprite.setDirection(90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, 90, "bottom overflow, direction parallel to edge (90): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "bottom overflow, direction parallel to edge (90): rotation not changed: event");
        sprite.setPositionX(0);
        sprite.setPositionY(-87);
        sprite.setDirection(-90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, -90, "bottom overflow, direction parallel to edge (-90): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "bottom overflow, direction parallel to edge (-90): rotation not changed: event");

        //bottom: direction changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(0);
        sprite.setPositionY(-47);
        sprite.setDirection(-120);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(lastUpdateEventArgs.properties.x === undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: bottom overflow: event argument check ('in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        assert.equal(overflowBottom, 0, "DO_NOT_ROTATE: bottom overflow: aligned after bounce ('in direction')");
        assert.equal(sprite.direction, -60, "DO_NOT_ROTATE: bottom: direction changed ('in direction')");
        assert.equal(sprite.positionX, 0, "DO_NOT_ROTATE: bottom without direction change: x pos does not change ('in direction')");

        //left: direction not changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(-21);
        sprite.setPositionY(0);
        sprite.setDirection(90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "DO_NOT_ROTATE: left overflow (not 'in direction')");
        assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y === undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: left overflow: event argument check (not 'in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowLeft = -sprite.positionX - boundary.left - sw2;
        assert.equal(overflowLeft, 0, "DO_NOT_ROTATE: left overflow: aligned after bounce (not 'in direction')");
        assert.equal(sprite.direction, 90, "DO_NOT_ROTATE: left: direction not changed (not 'in direction')");
        assert.equal(sprite.positionY, 0, "DO_NOT_ROTATE: left without direction change: y pos does not change (not 'in direction')");

        sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        sprite.setPositionX(-41);
        sprite.setPositionY(0);
        sprite.setDirection(0);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, 0, "left overflow, direction parallel to edge (0): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "left overflow, direction parallel to edge (0): rotation not changed: event");
        sprite.setPositionX(-41);
        sprite.setPositionY(0);
        sprite.setDirection(180);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.equal(sprite.direction, 180, "left overflow, direction parallel to edge (180): direction not changed");
        assert.ok(lastUpdateEventArgs.properties.rotation === undefined, "left overflow, direction parallel to edge (180): rotation not changed: event");

        //left: direction changed
        sprite.setRotationStyle(PocketCode.RotationStyle.DO_NOT_ROTATE);
        sprite.setPositionX(-21);
        sprite.setPositionY(0);
        sprite.setDirection(-40);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y === undefined && lastUpdateEventArgs.properties.rotation === undefined && lastUpdateEventArgs.id == "spriteId_test", "DO_NOT_ROTATE: left overflow: event argument check ('in direction')");
        boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        overflowLeft = -sprite.positionX - boundary.left - sw2;
        assert.equal(overflowLeft, 0, "DO_NOT_ROTATE: left overflow: aligned after bounce ('in direction')");
        assert.equal(sprite.direction, 40, "DO_NOT_ROTATE: left: direction changed ('in direction')");
        assert.equal(sprite.positionY, 0, "DO_NOT_ROTATE: left without direction change: y pos does not change ('in direction')");

        //handle conflics: left-right
        sprite.setSize(1000);
        sprite.setPositionX(0);
        sprite.setPositionY(0);
        sprite.setDirection(0);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.notOk(opReturn, "conflict left-right, direction = 0: no update");
        assert.ok(lastUpdateEventArgs == undefined, "conflict left-right, direction = 0: no update event");

        sprite.setDirection(180);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.notOk(opReturn, "conflict left-right, direction = 180: no update");
        assert.ok(lastUpdateEventArgs == undefined, "conflict left-right, direction = 180: no update event");

        sprite.setPositionX(0);
        sprite.setPositionY(0);
        sprite.setDirection(80);    //handle right overflow
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(sprite.size / 100.0, 0, false, true);
        overflowRight = sprite.positionX + boundary.right - sw2;
        assert.equal(overflowRight, 0, "conflict left-right: right overflow (with conflict): aligned after bounce ('in direction')");
        assert.equal(sprite.direction, -80, "conflict left-right: right (with conflict): direction changed ('in direction')");

        sprite.setPositionX(0);
        sprite.setPositionY(0);
        sprite.setDirection(-40);    //handle left overflow
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(sprite.size / 100.0, 0, false, true);
        overflowLeft = -sprite.positionX - boundary.left - sw2;
        assert.equal(overflowLeft, 0, "conflict left-right: left overflow (with conflict): aligned after bounce ('in direction')");
        assert.equal(sprite.direction, 40, "conflict left-right: left (with conflict): direction changed ('in direction')");

        //handle conflict: top-bottom (overflow on all edges)
        sprite.setSize(20000);
        sprite.setPositionX(0);
        sprite.setPositionY(700);
        sprite.setDirection(90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(lastUpdateEventArgs.properties.y == undefined, "conflict top-bottom, direction = 0: no update event");

        sprite.setDirection(-90);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        assert.ok(lastUpdateEventArgs.properties.y == undefined, "conflict top-bottom, direction = 180: no update event");

        sprite.setPositionX(0);
        sprite.setPositionY(700);
        sprite.setDirection(80);    //handle top overflow
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(sprite.size / 100.0, 0, false, true);
        overflowTop = sprite.positionY + boundary.top - sh2;
        assert.equal(overflowTop, 0, "conflict top-bottom: top overflow (with conflict): aligned after bounce ('in direction')");
        assert.equal(sprite.direction, -100, "conflict top-bottom: top (with conflict): direction changed ('in direction, bounced on 2 edges')");
        //^^ 80 -> 100 -> -100

        sprite.setPositionX(0);
        sprite.setPositionY(700);
        sprite.setDirection(-100);    //handle bottom overflow
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(sprite.size / 100.0, 0, false, true);
        overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        assert.equal(overflowLeft, 0, "conflict top-bottom: bottom overflow (with conflict): aligned after bounce ('in direction')");
        assert.equal(sprite.direction, 80, "conflict top-bottom: bottom (with conflict): direction changed ('in direction, bounced on 2 edges')");
        //^^ -100 -> -80 -> 80


        //RotationStyle.LEFT_RIGHT
        sprite.setSize(100);
        sprite.setDirection(90);
        sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);



        //RotationStyle.ALL_AROUND
        sprite.setSize(100);
        sprite.setDirection(90);
        sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);


        //done();
        ////return;

        ////directions
        //sprite.setPositionX(-40);
        //sprite.setPositionY(0);
        //sprite.setDirection(-170);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 170, "left: direction changed (-170 -> 170)");

        //sprite.setPositionX(-40);
        //sprite.setPositionY(0);
        //sprite.setDirection(-90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 90, "left: direction changed (180 turn around)");

        //sprite.setPositionX(-40);
        //sprite.setPositionY(0);
        //sprite.setDirection(-40);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 40, "left: direction changed (-40 -> 40)");

        //sprite.setPositionX(-40);
        //sprite.setPositionY(0);
        //sprite.setDirection(0);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 0, "left: direction not changed (0 = sprite direction parallel to handled edge)");

        //sprite.setPositionX(-40);
        //sprite.setPositionY(0);
        //sprite.setDirection(180);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 180, "left: direction not changed (180 = sprite direction parallel to handled edge)");

        ////right
        //sprite.setPositionX(23);
        //sprite.setPositionY(0);
        //sprite.setDirection(-90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "simple: right overflow");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y === undefined && lastUpdateEventArgs.id == "spriteId_test", "right overflow: event argument check");
        //boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.equal(overflowRight, -2, "simple: right overflow: aligned after bounce");    //2px transparency on the right
        //assert.equal(sprite.direction, -90, "right: direction changed");
        ////directions
        //sprite.setPositionX(40);
        //sprite.setPositionY(0);
        //sprite.setDirection(10);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, -10, "right: direction changed (10 -> -10)");

        //sprite.setPositionX(40);
        //sprite.setPositionY(0);
        //sprite.setDirection(150);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, -150, "right: direction changed (150 -> -150)");

        //sprite.setPositionX(40);
        //sprite.setPositionY(0);
        //sprite.setDirection(0);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 0, "right: direction not changed (0)");
        //assert.equal(sprite.positionY, 0, "right without direction change: y pos does not change");

        //sprite.setPositionX(40);
        //sprite.setPositionY(0);
        //sprite.setDirection(180);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 180, "right: direction not changed (180)");


        ////top
        //sprite.setPositionX(0);
        //sprite.setPositionY(-54);
        //sprite.setDirection(180);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "simple: top overflow");
        //assert.ok(lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.x === undefined && lastUpdateEventArgs.id == "spriteId_test", "top overflow: event argument check");
        //boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //assert.equal(overflowTop, 0, "simple: top overflow: aligned after bounce");
        //assert.equal(sprite.direction, 180, "top: direction changed");
        ////directions
        //sprite.setPositionX(0);
        //sprite.setPositionY(70);
        //sprite.setDirection(-90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, -90, "top: direction not changed (-90 = sprite direction parallel to handled edge)");
        //assert.equal(sprite.positionX, 0, "top without direction change: x pos does not change");

        //sprite.setPositionX(0);
        //sprite.setPositionY(70);
        //sprite.setDirection(90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 90, "top: direction not changed (90 = sprite direction parallel to handled edge)");

        //sprite.setPositionX(0);
        //sprite.setPositionY(70);
        //sprite.setDirection(-20);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, -160, "top: direction changed (-20 -> -160)");

        //sprite.setPositionX(0);
        //sprite.setPositionY(70);
        //sprite.setDirection(40);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 140, "top: direction changed (40 -> 140)");

        ////bottom
        //sprite.setPositionX(0);
        //sprite.setPositionY(47);
        //sprite.setDirection(90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.ok(opReturn == true && lastUpdateEventArgs !== undefined, "simple: bottom overflow");
        //assert.ok(lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.x === undefined && lastUpdateEventArgs.id == "spriteId_test", "bottom overflow: event argument check");
        //boundary = sprite._currentLook.getBoundary(1, 0, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //assert.equal(overflowBottom, 0, "simple: bottom overflow: aligned after bounce");
        //assert.equal(sprite.direction, 0, "bottom: direction changed");
        ////directions
        //sprite.setPositionX(0);
        //sprite.setPositionY(-70);
        //sprite.setDirection(90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 90, "bottom: direction not changed (90 = sprite direction parallel to handled edge)");
        //assert.equal(sprite.positionX, 0, "bottom without direction change: x pos does not change");

        //sprite.setPositionX(0);
        //sprite.setPositionY(-70);
        //sprite.setDirection(-90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, -90, "bottom: direction not changed (-90 = sprite direction parallel to handled edge)");

        //sprite.setPositionX(0);
        //sprite.setPositionY(-70);
        //sprite.setDirection(100);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, 80, "bottom: direction not changed (100 -> 80)");

        //sprite.setPositionX(0);
        //sprite.setPositionY(-70);
        //sprite.setDirection(-170);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(sprite.direction, -10, "bottom: direction not changed (-170 -> -10)");


        ////including rotation
        //sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);
        ////left
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(lastUpdateEventArgs, undefined, "rotation: left but without overflow: no event triggered");

        //sprite.setPositionX(-40);
        //sprite.setPositionY(0);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.equal(overflowLeft, 0, "rotation: left overflow: aligned after bounce");

        ////right
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(lastUpdateEventArgs, undefined, "rotation: right but without overflow: no event triggered");

        //sprite.setPositionX(40);
        //sprite.setPositionY(0);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.equal(overflowRight, 0, "rotation: right overflow: aligned after bounce");

        ////top
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(lastUpdateEventArgs, undefined, "rotation: top but without overflow: no event triggered");

        //sprite.setPositionX(0);
        //sprite.setPositionY(70);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //assert.equal(overflowTop, 0, "rotation: top overflow: aligned after bounce");

        ////bottom
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //assert.equal(lastUpdateEventArgs, undefined, "rotation: bottom but without overflow: no event triggered");

        //sprite.setPositionX(0);
        //sprite.setPositionY(-70);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //assert.equal(overflowBottom, 0, "rotation: bottom overflow: aligned after bounce");

        ////overflow on two sides without conflicts (look size > viewport size)
        ////top right: one edge in direction
        //sprite.setPositionX(40);
        //sprite.setPositionY(70);
        //sprite.setDirection(-5);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowTop == 0 && overflowRight == 0, "top/right: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "top/right: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, -175, "top/right: direction after bounce");
        ////top right: both edges in direction
        //sprite.setPositionX(40);
        //sprite.setPositionY(70);
        //sprite.setDirection(45);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowTop == 0 && overflowRight == 0, "top/right: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "top/right: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, -135, "top/right: direction after bounce");


        ////top left: one edge in direction
        //sprite.setPositionX(-40);
        //sprite.setPositionY(70);
        //sprite.setDirection(15);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowTop == 0 && overflowLeft == 0, "top/left: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "top/left: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, 165, "top/left: direction after bounce");
        ////top left: both edges in direction
        //sprite.setPositionX(-40);
        //sprite.setPositionY(70);
        //sprite.setDirection(-5);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowTop == 0 && overflowLeft == 0, "top/left: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "top/left: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, 175, "top/left: direction after bounce");

        ////bottom right: one edge in direction
        //sprite.setPositionX(40);
        //sprite.setPositionY(-70);
        //sprite.setDirection(5);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowBottom == 0 && overflowRight == 0, "bottom/right: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "bottom/right: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, -5, "bottom/right: direction after bounce");
        ////bottom right: both edges in direction
        //sprite.setPositionX(40);
        //sprite.setPositionY(-70);
        //sprite.setDirection(105);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowBottom == 0 && overflowRight == 0, "bottom/right: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "bottom/right: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, -75, "bottom/right: direction after bounce");

        ////bottom left
        //sprite.setPositionX(-40);
        //sprite.setPositionY(-70);
        //sprite.setDirection(-95);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowBottom == 0 && overflowLeft == 0, "bottom/left: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "bottom/left: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, 85, "bottom/left: direction after bounce");

        ////flipX
        //sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);
        //sprite.setPositionX(40);
        //sprite.setPositionY(-70);
        //sprite.setDirection(105);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, 0, true, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowBottom == 0 && overflowRight == 0, "flipX: bottom/right: 2 sides + rotation: aligned after bounce");
        //assert.ok(lastUpdateEventArgs.properties.x !== undefined && lastUpdateEventArgs.properties.y !== undefined && lastUpdateEventArgs.properties.direction !== undefined, "flipX: bottom/right: 2 sides + rotation: event args check");
        //assert.equal(sprite.direction, -75, "flipX: bottom/right: direction after bounce");


        ////complex cases: overflow on opposite edges (before/after rotate)

        //sprite.currentLook = {
        //    imageId: "i9",
        //};
        //sprite.setRotationStyle(PocketCode.RotationStyle.ALL_AROUND);

        ////overflow on all sides: the sprite should bounce from the top/right corner(direction = 90)
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowTop == 0 && overflowRight == 0, "complex: bounce from top/right");

        ////overflow on all sides: the sprite should bounce from the bottom/right corner (direction = 100)
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(100);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowBottom == 0 && overflowRight == 0, "complex: bounce from bottom/right");

        ////overflow on all sides: the sprite should bounce from the top/left corner(direction = -90)
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(-90);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowTop == 0 && overflowLeft == 0, "complex: bounce from top/left");

        ////overflow on all sides: the sprite should bounce from the bottom/left corner (direction = -100)
        //sprite.setPositionX(0);
        //sprite.setPositionY(0);
        //sprite.setDirection(-100);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowBottom == 0 && overflowLeft == 0, "complex: bounce from bottom/left");

        ////overflow on three sides
        //sprite.currentLook = {
        //    imageId: "i10",
        //};

        //sprite.setPositionX(0);
        //sprite.setPositionY(100);
        //sprite.setDirection(0);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowTop == 0 && overflowRight == 0, "complex (3 sides): bounce from top/right");

        //sprite.setPositionX(0);
        //sprite.setPositionY(-100);
        //sprite.setDirection(0);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        //assert.ok(overflowBottom == 0 && overflowRight == 0, "complex (3 sides): bounce from bottom/right");

        ////take care of overflows that occur during bounce
        //sprite.setPositionX(-100);
        //sprite.setPositionY(0);
        //sprite.setDirection(-105);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowLeft == 0, "complex (overflow during bounce): left");

        ////test on top/bottom: landscape
        //gameEngine._originalScreenHeight = 50;
        //gameEngine._originalScreenWidth = 100;
        //sh2 = gameEngine._originalScreenHeight * 0.5,
        //sw2 = gameEngine._originalScreenWidth * 0.5;
        //gameEngine._collisionManager = new PocketCode.CollisionManager(gameEngine._originalScreenWidth, gameEngine._originalScreenHeight);
        ////sprite.size = 200;

        //sprite.setPositionX(100);
        //sprite.setPositionY(0);
        //sprite.setDirection(80);
        //lastUpdateEventArgs = undefined;
        //opReturn = sprite.ifOnEdgeBounce();
        //boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowTop = sprite.positionY + boundary.top - sh2;
        //overflowRight = sprite.positionX + boundary.right - sw2;
        ////overflowLeft = -sprite.positionX - boundary.left - sw2;
        //assert.ok(overflowTop == 0 && overflowRight == 0, "complex: overflow during bounce (after rotate) from top/bottom");

        //imagge11: diagonal
        //sprite.currentLook = {
        //    imageId: "i11",
        //};
        sprite.setLook("i_11");

        gameEngine._originalScreenHeight = 50;
        gameEngine._originalScreenWidth = 50;
        sh2 = gameEngine._originalScreenHeight * 0.5,
        sw2 = gameEngine._originalScreenWidth * 0.5;
        gameEngine._collisionManager = new PocketCode.CollisionManager(gameEngine._originalScreenWidth, gameEngine._originalScreenHeight);
        //top
        sprite.setPositionX(0);
        sprite.setPositionY(40);
        sprite.setDirection(45);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        overflowTop = sprite.positionY + boundary.top - sh2;
        overflowRight = sprite.positionX + boundary.right - sw2;
        assert.ok(overflowTop <= 0 && overflowRight <= 0, "complex: overflow during bounce (after rotate) from left/right: 45");
        //bottom
        sprite.setPositionX(0);
        sprite.setPositionY(-40);
        sprite.setDirection(-135);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        overflowLeft = -sprite.positionX - boundary.left - sw2;
        assert.ok(overflowBottom <= 0 && overflowLeft <= 0, "complex: overflow during bounce (after rotate) from left/right: -135");
        //right
        sprite.setPositionX(40);
        sprite.setPositionY(0);
        sprite.setDirection(135);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        //overflowTop = sprite.positionY + boundary.top - sh2;
        overflowRight = sprite.positionX + boundary.right - sw2;
        //overflowLeft = -sprite.positionX - boundary.left - sw2;
        assert.ok(overflowBottom <= 0 && overflowRight <= 0, "complex: overflow during bounce (after rotate) from top/bottom: 135");
        //left
        sprite.setPositionX(-40);
        sprite.setPositionY(0);
        sprite.setDirection(-45);
        lastUpdateEventArgs = undefined;
        opReturn = sprite.ifOnEdgeBounce();
        boundary = sprite._currentLook.getBoundary(1, sprite.direction - 90, false, true);
        //overflowBottom = -sprite.positionY - boundary.bottom - sh2;
        overflowTop = sprite.positionY + boundary.top - sh2;
        overflowLeft = -sprite.positionX - boundary.left - sw2;
        assert.ok(overflowTop <= 0 && overflowLeft <= 0, "complex: overflow during bounce (after rotate) from top/bottom: -135");

        done();
    };
});


QUnit.test("PhysicsSprite", function (assert) {
    //assert.ok(false, "TODO");
    //return;
    //TODO:: refactoring, scenes + cntr arguments


    var gameEngine = new PocketCode.GameEngine();
    var scene = new PocketCode.Model.Scene(gameEngine, undefined, []);

    var sprite = new PocketCode.Model.PhysicsSprite(gameEngine, scene, { id: "id", name: "name" });

    //setter/getter tests
    var value = 234;
    sprite.mass = value;
    assert.equal(sprite._mass, value, "mass set correctly");

    value = 42;
    sprite.friction = value;
    assert.equal(sprite._friction, value, "friction set correctly");

    value = 1;
    sprite.bounceFactor = value;
    assert.equal(sprite._bounceFactor, value, "bounceFactor set correctly");

    sprite.physicsType = value;
    assert.equal(sprite._physicsType, value, "movementStyle set correctly");

    //var x = 23;
    //var y = 234;
    //var setGravityCalled = false;
    //scene.setGravity = function (gravityX, gravityY) {
    //    setGravityCalled = gravityX === x && gravityY === y;
    //};

    //sprite.setGravity(x, y);
    //assert.ok(setGravityCalled, "set gravity sets gravity in GE");

    var x = 84;
    var y = 2;

    sprite.setVelocity(x, y);
    assert.equal(sprite._velocityX, x, "velocityX set correctly");
    assert.equal(sprite._velocityY, y, "velocityY set correctly");

    assert.ok(false, "TODO");
});



QUnit.test("SpriteClone", function (assert) {

    var done = assert.async();
    var device = new PocketCode.MediaDevice();
    var gameEngine = new PocketCode.GameEngine();
    var broadcastMgr = new PocketCode.BroadcastManager([{ id: "s12", name: "test" }]);
    var scene = new PocketCode.Model.Scene(gameEngine, device, []);

    assert.throws(function () { new PocketCode.Model.SpriteClone(gameEngine, scene, { id: "newId" }, undefined) }, Error, "ERROR: missing parameter for SpriteClone: definition");

    var sprite = new PocketCode.Model.SpriteClone(gameEngine, scene, { id: "newId", name: "myName" }, {});

    assert.ok(sprite instanceof PocketCode.Model.SpriteClone && sprite instanceof PocketCode.Model.Sprite && sprite instanceof PocketCode.Model.UserVariableHost, "instance check");

    assert.ok(sprite.onExecuted instanceof SmartJs.Event.Event, "event instances + getter");

    //test if sound and look copied correctly //todo: looks
    var tmpBricks = [];
    var looks = [{ id: 1, imageId: "s1", name: "name1", resourceId: "s1" }];
    var sound = [1, 2];

    var sprite3 = new PocketCode.Model.SpriteClone(gameEngine, scene, { id: "3", name: "newName3", scripts: tmpBricks, sounds: sound }, {});
    assert.ok(sprite3._sounds.length === 2, "Sounds in SpriteClone copied correct");

    //test methode clone
    var scene2 = new PocketCode.Model.Scene(gameEngine, device, []);
    var sprite2 = new PocketCode.Model.SpriteClone(gameEngine, scene, { id: "2", name: "newName", scripts: tmpBricks }, {});

    var brick1 = new PocketCode.Model.WhenProgramStartBrick(device, sprite2, { x: 1, y: 2 }, scene2.onStart);
    brick1._id = "first";
    tmpBricks[0] = brick1;
    sprite2.scripts.push(tmpBricks);

    sprite2.looks = looks;
    scene2._sprites.push(sprite2);

    sprite2.penDown = true;
    sprite2.penSize = 6;
    sprite2.setSize(40);
    sprite2.hide();

    var clone_sprite2 = sprite2.clone(device, broadcastMgr);
    assert.ok(clone_sprite2._penDown == sprite2._penDown &&
        clone_sprite2._penSize == sprite2._penSize &&
        clone_sprite2.size == sprite2.size &&
        clone_sprite2.visible == sprite2.visible, "set properties for clone correct (clone from SpriteClone)");

    //test clone
    var is = new PocketCode.ImageStore();   //recreate
    gameEngine._imageStore = is;

    //init tests
    var baseUrl = "_resources/images/",
        images = [
            { id: "s4", url: "imgHelper15.png", size: 2 },
            { id: "s5", url: "imgHelper16.png", size: 2 },
        ];

    is.onLoad.addEventListener(new SmartJs.Event.EventListener(startTest));
    is.loadImages(baseUrl, images);

    var clone;
    function startTest() {
        scene.load(cloneScene); //global ressource defined in _resources/testDataProject
        scene.initializeSprites();  //images already loaded- initilaze look objects
        sprite = scene._sprites[0];


        sprite.penDown = true;
        sprite.penSize = 6;
        sprite.penColor = { r: 255, g: 20, b: 20 };
        sprite.setPositionX(300);
        sprite.setPositionY(100);
        sprite.rotate(10);
        sprite.setRotationStyle(PocketCode.RotationStyle.LEFT_TO_RIGHT);
        sprite.nextLook();  //set this._currentLook
        sprite.setSize(50);
        sprite.hide();
        sprite.setGraphicEffect(PocketCode.GraphicEffect.GHOST, 10);
        sprite.setGraphicEffect(PocketCode.GraphicEffect.BRIGHTNESS, 20);
        sprite.setGraphicEffect(PocketCode.GraphicEffect.COLOR, 30);
        // show/hide bubble

        var variable1 = sprite.getVariable("s20");
        variable1.value = 5;
        var variable2 = sprite.getVariable("s21");
        variable2.value = 10;
        var list1 = sprite.getList("s22");
        list1.append("test");
        list1.append(34);
        var list2 = sprite.getList("s23");
        list2.append("test2");
        list2.append(1);
        // var tmpSprite = new PocketCode.Model.SpriteClone(gameEngine, scene, {id: "2", name: "newName",  lists: list1._value}, {lists: list1._value});

        scene.start();
        setTimeout(validateClone, 10);
    }

    function validateClone() {
        clone = scene._sprites[0];

        //check looks
        assert.ok(clone._penDown == sprite._penDown &&
            clone._penSize == sprite._penSize &&
            clone._penColor.b == sprite._penColor.b &&
            clone._penColor.r == sprite._penColor.r &&
            clone._penColor.g == sprite._penColor.g &&
            clone._penColor != sprite._penColor &&  /* new object but same values */
            clone.positionX == sprite.positionX &&
            clone.positionY == sprite.positionY &&
            clone._lookOffsetX == sprite._lookOffsetX &&
            clone._lookOffsetY == sprite._lookOffsetY &&
            clone.direction == sprite.direction &&
            clone.rotationStyle == sprite.rotationStyle &&
            clone.size == sprite.size &&
            clone.visible == sprite.visible &&
            clone.transparency == sprite.transparency &&
            clone.brightness == sprite.brightness &&
            clone.colorEffect == sprite.colorEffect, "set properties correct");

        assert.equal(clone._currentLook.id, sprite._currentLook.id, "current look id set");
        assert.notEqual(clone._currentLook, sprite._currentLook, "Individual Look objects");

        assert.ok(clone._scripts.length > 0, "brick created");
        assert.ok(clone.getVariable("s20") !== sprite.getVariable("s20") &&
            clone.getVariable("s21") !== sprite.getVariable("s21") &&
            clone.getList("s22")._value !== sprite.getList("s22")._value &&
            clone.getList("s23")._value !== sprite.getList("s23")._value, "Variables and Lists created");

        assert.ok(clone.getVariable("s20").value == sprite.getVariable("s20").value &&
            clone.getVariable("s21").value == sprite.getVariable("s21").value &&
            clone.getList("s22")._value[0] == sprite.getList("s22")._value[0] &&
            clone.getList("s22")._value[1] == sprite.getList("s22")._value[1] &&
            clone.getList("s23")._value[0] == sprite.getList("s23")._value[0] &&
            clone.getList("s23")._value[1] == sprite.getList("s23")._value[1], "Variables and List values set");

        var list1 = sprite.getList("s22");
        list1.replaceAt(2, 40);

        assert.notEqual(clone.getList("s22")._value[1], sprite.getList("s22")._value[1], "Independent list items");
        done();
    }
});


QUnit.test("Background", function (assert) {

    var done1 = assert.async();
    var done2 = assert.async();

    var device = new PocketCode.MediaDevice();
    var gameEngine = new PocketCode.GameEngine();
    var scene = new PocketCode.Model.Scene(gameEngine, device, []);

    var testBackgroundSprite = new PocketCode.Model.BackgroundSprite(gameEngine, scene, { id: "newId", name: "myName" });

    var look1 = { name: "look1", id: "first", resourceId: "1" };
    var look2 = { name: "look2", id: "second", resourceId: "2" };
    testBackgroundSprite.looks = [look1, look2];

    var handlerOneCalled = 0;
    var handlerLookOne = function () {
        handlerOneCalled++;
        assert.ok(handlerOneCalled == 1 && handlerTwoCalled == 1, "Event called, Background changed to first");
        done1();
        testBackgroundSprite.unsubscribeFromLookChange("second", handlerLookTwo);
        testBackgroundSprite.setLook("second");

        window.setTimeout(function () {
            assert.ok(handlerOneCalled == 1 && handlerTwoCalled == 1, "unsubscribed successfully");
            runTest2();
        }, 20);
    };

    var handlerTwoCalled = 0;
    var handlerLookTwo = function () {
        handlerTwoCalled++;
        assert.ok(handlerOneCalled == 0 && handlerTwoCalled == 1, "Event called, Background changed to second");
        testBackgroundSprite.setLook("second");
        testBackgroundSprite.setLook("first");
    };

    testBackgroundSprite.subscribeOnLookChange("first", handlerLookOne);
    testBackgroundSprite.subscribeOnLookChange("second", handlerLookTwo);
    testBackgroundSprite.setLook("first");
    testBackgroundSprite.setLook("second");

    //change bg and wait callback
    function runTest2() {
        var called = 0,
            changed;
        var callbackHandler = function (args) {
            called++;
            changed = args;
        };
        testBackgroundSprite.setLook("second", callbackHandler);
        assert.equal(called, 1, "wait callback called even if background not changed");
        assert.equal(changed, false, "wait callback called even if background not changed- loop delay");

        done2();
    }

});

