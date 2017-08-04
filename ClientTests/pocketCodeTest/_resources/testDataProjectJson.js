




var project_v03_0992 = { "id": 17, "header": { "languageVersion": 0.992, "description": "", "title": "all bricks 161228", "url": "", "author": "", "bricksCount": 124, "device": { "screenHeight": 1184, "screenWidth": 720, "screenMode": "STRETCH" }, "cloud": { "variables": [] } }, "scenes": [{ "id": "s2", "name": "Scene 1", "screenHeight": 1184, "screenWidth": 720, "background": { "id": "s4", "name": "Background", "scripts": [{ "id": "s11", "bricks": [], "type": "WhenProgramStart", "commentedOut": false }, { "action": "Tapped", "id": "s12", "bricks": [], "type": "WhenAction", "commentedOut": false }, { "action": "TouchStart", "id": "s13", "bricks": [], "type": "WhenAction", "commentedOut": false }, { "receiveMsgId": "s14", "id": "s15", "bricks": [{ "broadcastMsgId": "s16", "type": "Broadcast", "commentedOut": false }, { "broadcastMsgId": "s17", "type": "BroadcastAndWait", "commentedOut": false }], "type": "WhenBroadcastReceive", "commentedOut": false }, { "condition": { "type": "OPERATOR", "value": "SMALLER_THAN", "left": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "right": { "type": "NUMBER", "value": "2", "left": null, "right": null } }, "id": "s18", "bricks": [], "type": "WhenConditionMet", "commentedOut": false }, { "any": true, "spriteId": null, "id": "s19", "bricks": [], "type": "WhenCollision", "commentedOut": false }, { "lookId": "s8", "id": "s20", "bricks": [], "type": "WhenBackgroundChangesTo", "commentedOut": false }, { "id": "s21", "bricks": [], "type": "WhenStartAsClone", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s8", "resourceId": "s7", "name": "background 1" }, { "id": "s10", "resourceId": "s9", "name": "background 2" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, "sprites": [{ "id": "s5", "name": "sp1", "scripts": [], "userScripts": [], "looks": [{ "id": "s23", "resourceId": "s22", "name": "sp1l1" }, { "id": "s25", "resourceId": "s24", "name": "sp1l2" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s6", "name": "sp2", "scripts": [], "userScripts": [], "looks": [{ "id": "s27", "resourceId": "s26", "name": "sp2l1" }, { "id": "s29", "resourceId": "s28", "name": "sp2l2" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }] }, { "id": "s3", "name": "scene2", "screenHeight": 1184, "screenWidth": 720, "background": { "id": "s30", "name": "Background", "scripts": [], "userScripts": [], "looks": [{ "id": "s41", "resourceId": "s40", "name": "bg1" }, { "id": "s43", "resourceId": "s42", "name": "bg2" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, "sprites": [{ "id": "s31", "name": "sp1", "scripts": [{ "id": "s46", "bricks": [{ "physicsType": "FIXED", "type": "SetPhysicsObjectType", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s45", "resourceId": "s44", "name": "sp1l1" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s32", "name": "events", "scripts": [{ "id": "s49", "bricks": [], "type": "WhenProgramStart", "commentedOut": false }, { "action": "Tapped", "id": "s50", "bricks": [], "type": "WhenAction", "commentedOut": false }, { "action": "TouchStart", "id": "s51", "bricks": [], "type": "WhenAction", "commentedOut": false }, { "receiveMsgId": "s16", "id": "s52", "bricks": [{ "broadcastMsgId": "s16", "type": "Broadcast", "commentedOut": false }, { "broadcastMsgId": "s16", "type": "BroadcastAndWait", "commentedOut": false }], "type": "WhenBroadcastReceive", "commentedOut": false }, { "condition": { "type": "OPERATOR", "value": "SMALLER_THAN", "left": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "right": { "type": "NUMBER", "value": "2", "left": null, "right": null } }, "id": "s53", "bricks": [], "type": "WhenConditionMet", "commentedOut": false }, { "any": true, "spriteId": null, "id": "s54", "bricks": [], "type": "WhenCollision", "commentedOut": false }, { "lookId": "s41", "id": "s55", "bricks": [], "type": "WhenBackgroundChangesTo", "commentedOut": false }, { "id": "s56", "bricks": [], "type": "WhenStartAsClone", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s48", "resourceId": "s47", "name": "events" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s33", "name": "control", "scripts": [{ "id": "s59", "bricks": [{ "duration": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "Wait", "commentedOut": false }, { "text": "", "type": "Note", "commentedOut": false }, { "bricks": [{ "condition": { "type": "OPERATOR", "value": "SMALLER_THAN", "left": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "right": { "type": "NUMBER", "value": "2", "left": null, "right": null } }, "ifBricks": [], "elseBricks": [], "showElse": true, "type": "IfThenElse", "commentedOut": false }, { "condition": { "type": "OPERATOR", "value": "SMALLER_THAN", "left": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "right": { "type": "NUMBER", "value": "2", "left": null, "right": null } }, "ifBricks": [], "elseBricks": [], "showElse": false, "type": "IfThenElse", "commentedOut": false }, { "condition": { "type": "OPERATOR", "value": "SMALLER_THAN", "left": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "right": { "type": "NUMBER", "value": "2", "left": null, "right": null } }, "bricks": [], "type": "WaitUntil", "commentedOut": false }, { "timesToRepeat": { "type": "NUMBER", "value": "10", "left": null, "right": null }, "bricks": [], "type": "Repeat", "commentedOut": false }, { "condition": { "type": "OPERATOR", "value": "SMALLER_THAN", "left": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "right": { "type": "NUMBER", "value": "2", "left": null, "right": null } }, "bricks": [], "type": "RepeatUntil", "commentedOut": false }, { "sceneId": "s2", "type": "SceneTransition", "commentedOut": false }, { "sceneId": "s2", "type": "StartScene", "commentedOut": false }, { "scriptType": "this", "type": "StopScript", "commentedOut": false }, { "scriptType": "all", "type": "StopScript", "commentedOut": false }, { "scriptType": "other", "type": "StopScript", "commentedOut": false }, { "spriteId": "s33", "type": "Clone", "commentedOut": false }, { "spriteId": "s32", "type": "Clone", "commentedOut": false }, { "type": "DeleteClone", "commentedOut": false }], "type": "Forever", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s58", "resourceId": "s57", "name": "control" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s34", "name": "motion", "scripts": [{ "id": "s62", "bricks": [{ "x": { "type": "NUMBER", "value": "100", "left": null, "right": null }, "y": { "type": "NUMBER", "value": "200", "left": null, "right": null }, "type": "GoToPosition", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "100", "left": null, "right": null }, "type": "SetX", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "200", "left": null, "right": null }, "type": "SetY", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "10", "left": null, "right": null }, "type": "ChangeX", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "10", "left": null, "right": null }, "type": "ChangeY", "commentedOut": false }, { "destinationType": "pointer", "spriteId": null, "type": "GoTo", "commentedOut": false }, { "destinationType": "random", "spriteId": null, "type": "GoTo", "commentedOut": false }, { "destinationType": "sprite", "spriteId": "s31", "type": "GoTo", "commentedOut": false }, { "type": "IfOnEdgeBounce", "commentedOut": false }, { "steps": { "type": "NUMBER", "value": "10.0", "left": null, "right": null }, "type": "MoveNSteps", "commentedOut": false }, { "degrees": { "type": "NUMBER", "value": "15.0", "left": null, "right": null }, "type": "TurnLeft", "commentedOut": false }, { "degrees": { "type": "NUMBER", "value": "15.0", "left": null, "right": null }, "type": "TurnRight", "commentedOut": false }, { "degrees": { "type": "NUMBER", "value": "90.0", "left": null, "right": null }, "type": "SetDirection", "commentedOut": false }, { "pointer": false, "spriteId": "s31", "type": "SetDirectionTo", "commentedOut": false }, { "selected": "0", "type": "SetRotationStyle", "commentedOut": false }, { "selected": "1", "type": "SetRotationStyle", "commentedOut": false }, { "selected": "2", "type": "SetRotationStyle", "commentedOut": false }, { "x": { "type": "NUMBER", "value": "100", "left": null, "right": null }, "y": { "type": "NUMBER", "value": "200", "left": null, "right": null }, "duration": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "GlideTo", "commentedOut": false }, { "layers": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "type": "GoBack", "commentedOut": false }, { "type": "ComeToFront", "commentedOut": false }, { "duration": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "Vibration", "commentedOut": false }, { "physicsType": "DYNAMIC", "type": "SetPhysicsObjectType", "commentedOut": false }, { "physicsType": "FIXED", "type": "SetPhysicsObjectType", "commentedOut": false }, { "physicsType": "NONE", "type": "SetPhysicsObjectType", "commentedOut": false }, { "x": { "type": "NUMBER", "value": "0.0", "left": null, "right": null }, "y": { "type": "NUMBER", "value": "0.0", "left": null, "right": null }, "type": "SetVelocity", "commentedOut": false }, { "degreesPerSec": { "type": "NUMBER", "value": "15.0", "left": null, "right": null }, "type": "RotationSpeedLeft", "commentedOut": false }, { "degreesPerSec": { "type": "NUMBER", "value": "15.0", "left": null, "right": null }, "type": "RotationSpeedRight", "commentedOut": false }, { "x": { "type": "NUMBER", "value": "0.0", "left": null, "right": null }, "y": { "type": "OPERATOR", "value": "MINUS", "left": null, "right": { "type": "NUMBER", "value": "10.0", "left": null, "right": null } }, "type": "SetGravity", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "SetMass", "commentedOut": false }, { "percentage": { "type": "NUMBER", "value": "80.0", "left": null, "right": null }, "type": "SetBounceFactor", "commentedOut": false }, { "percentage": { "type": "NUMBER", "value": "20.0", "left": null, "right": null }, "type": "SetFriction", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s61", "resourceId": "s60", "name": "motion" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s35", "name": "sound", "scripts": [{ "id": "s66", "bricks": [{ "resourceId": "s65", "type": "PlaySound", "commentedOut": false }, { "resourceId": "s65", "type": "PlaySoundAndWait", "commentedOut": false }, { "type": "StopAllSounds", "commentedOut": false }, { "percentage": { "type": "NUMBER", "value": "60.0", "left": null, "right": null }, "type": "SetVolume", "commentedOut": false }, { "value": { "type": "OPERATOR", "value": "MINUS", "left": null, "right": { "type": "NUMBER", "value": "10.0", "left": null, "right": null } }, "type": "ChangeVolume", "commentedOut": false }, { "text": { "type": "STRING", "value": "Hello! Long text loading issue?", "left": null, "right": null }, "type": "Speak", "commentedOut": false }, { "text": { "type": "STRING", "value": "Hello!", "left": null, "right": null }, "type": "SpeakAndWait", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s64", "resourceId": "s63", "name": "sound" }], "sounds": [{ "resourceId": "s65", "name": "DrumMachine" }], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s36", "name": "look", "scripts": [{ "id": "s69", "bricks": [{ "lookId": "s68", "type": "SetLook", "commentedOut": false }, { "type": "NextLook", "commentedOut": false }, { "type": "PreviousLook", "commentedOut": false }, { "percentage": { "type": "NUMBER", "value": "60.0", "left": null, "right": null }, "type": "SetSize", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "10.0", "left": null, "right": null }, "type": "ChangeSize", "commentedOut": false }, { "type": "Hide", "commentedOut": false }, { "type": "Show", "commentedOut": false }, { "question": { "type": "STRING", "value": "'What's your name?'", "left": null, "right": null }, "resourceId": null, "type": "Ask", "commentedOut": false }, { "text": { "type": "STRING", "value": "Hello!", "left": null, "right": null }, "type": "Say", "commentedOut": false }, { "duration": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "text": { "type": "STRING", "value": "Hello!", "left": null, "right": null }, "type": "SayFor", "commentedOut": false }, { "text": { "type": "STRING", "value": "Hmmmm!", "left": null, "right": null }, "type": "Think", "commentedOut": false }, { "duration": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "text": { "type": "STRING", "value": "Hmmmm!", "left": null, "right": null }, "type": "ThinkFor", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "50.0", "left": null, "right": null }, "effect": "ghost", "type": "SetTransparency", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "25.0", "left": null, "right": null }, "effect": "ghost", "type": "ChangeTransparency", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "50.0", "left": null, "right": null }, "effect": "brightness", "type": "SetBrightness", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "25.0", "left": null, "right": null }, "effect": "brightness", "type": "ChangeBrightness", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "0.0", "left": null, "right": null }, "effect": "color", "type": "SetColorEffect", "commentedOut": false }, { "value": { "type": "NUMBER", "value": "25.0", "left": null, "right": null }, "effect": "color", "type": "ChangeColorEffect", "commentedOut": false }, { "type": "ClearGraphicEffect", "commentedOut": false }, { "lookId": "s41", "type": "SetBackground", "commentedOut": false }, { "lookId": "s43", "type": "SetBackgroundAndWait", "commentedOut": false }, { "selected": "0", "type": "Camera", "commentedOut": false }, { "selected": "1", "type": "Camera", "commentedOut": false }, { "selected": "0", "type": "SelectCamera", "commentedOut": false }, { "selected": "1", "type": "SelectCamera", "commentedOut": false }, { "selected": "0", "type": "Flash", "commentedOut": false }, { "selected": "1", "type": "Flash", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s68", "resourceId": "s67", "name": "look" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s37", "name": "pen", "scripts": [{ "id": "s72", "bricks": [{ "type": "PenDown", "commentedOut": false }, { "type": "PenUp", "commentedOut": false }, { "size": { "type": "NUMBER", "value": "4", "left": null, "right": null }, "type": "SetPenSize", "commentedOut": false }, { "r": { "type": "NUMBER", "value": "0", "left": null, "right": null }, "g": { "type": "NUMBER", "value": "0", "left": null, "right": null }, "b": { "type": "NUMBER", "value": "255", "left": null, "right": null }, "type": "SetPenColor", "commentedOut": false }, { "type": "Stamp", "commentedOut": false }, { "type": "ClearBackground", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s71", "resourceId": "s70", "name": "pen" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }, { "id": "s38", "name": "data", "scripts": [{ "id": "s75", "bricks": [{ "question": { "type": "STRING", "value": "'What's your name?'", "left": null, "right": null }, "resourceId": "s76", "type": "Ask", "commentedOut": false }, { "resourceId": "s76", "value": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "SetVariable", "commentedOut": false }, { "resourceId": "s76", "value": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "ChangeVariable", "commentedOut": false }, { "resourceId": "s76", "x": { "type": "NUMBER", "value": "100", "left": null, "right": null }, "y": { "type": "NUMBER", "value": "200", "left": null, "right": null }, "type": "ShowVariable", "commentedOut": false }, { "resourceId": "s76", "type": "HideVariable", "commentedOut": false }, { "resourceId": "s1", "value": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "AppendToList", "commentedOut": false }, { "resourceId": "s1", "index": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "type": "DeleteAtList", "commentedOut": false }, { "resourceId": "s1", "index": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "value": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "InsertAtList", "commentedOut": false }, { "resourceId": "s1", "index": { "type": "NUMBER", "value": "1", "left": null, "right": null }, "value": { "type": "NUMBER", "value": "1.0", "left": null, "right": null }, "type": "ReplaceAtList", "commentedOut": false }], "type": "WhenProgramStart", "commentedOut": false }], "userScripts": [], "looks": [{ "id": "s74", "resourceId": "s73", "name": "data" }], "sounds": [], "variables": [{ "id": "s76", "name": "answer" }], "lists": [], "nfcTags": [] }, { "id": "s39", "name": "user bricks", "scripts": [], "userScripts": [], "looks": [{ "id": "s78", "resourceId": "s77", "name": "user bricks" }], "sounds": [], "variables": [], "lists": [], "nfcTags": [] }] }], "resourceBaseUrl": "http:\/\/localhost:80\/html5\/projects\/v0.4\/17\/", "images": [{ "id": "s7", "url": "Scene 1\/images\/ce13a6a48398df269c0725ba3945eb4a_look.png", "size": 13422 }, { "id": "s9", "url": "Scene 1\/images\/56ce0d51e91ef4f76028c0d4439f8b8f_look.png", "size": 14304 }, { "id": "s22", "url": "Scene 1\/images\/315d85359be7142fcd61cf48491a3232_look.png", "size": 27463 }, { "id": "s24", "url": "Scene 1\/images\/a586409c1d24e2c6691330fa8bf15578_look.png", "size": 23634 }, { "id": "s26", "url": "Scene 1\/images\/1144c3e1f45622ca4273b12719c9c6de_look.png", "size": 25740 }, { "id": "s28", "url": "Scene 1\/images\/fb460b9c43d7d6b0b24ccf0c0911c7be_look.png", "size": 29677 }, { "id": "s40", "url": "scene2\/images\/49ff589fe6791049ad91895491b33516_look.png", "size": 13496 }, { "id": "s42", "url": "scene2\/images\/8a4fb9aff2d18e4ffcf153f8ddbcb3a8_look.png", "size": 14273 }, { "id": "s44", "url": "scene2\/images\/e95b48e3bb60e346ec427c87dae6451e_look.png", "size": 25228 }, { "id": "s47", "url": "scene2\/images\/defa61bdedb892fc2722aeafa11ca1b8_look.png", "size": 16013 }, { "id": "s57", "url": "scene2\/images\/c2fe7e06bddf1cc13802d913f3e74a1b_look.png", "size": 16847 }, { "id": "s60", "url": "scene2\/images\/f889cf46ca4a3886d13c4e594dbb28b8_look.png", "size": 19551 }, { "id": "s63", "url": "scene2\/images\/53a9620a2bed3e8fbc3f172f314a5a1a_look.png", "size": 16307 }, { "id": "s67", "url": "scene2\/images\/c6f424e918a01b5d1bd5bc641496c0b3_look.png", "size": 16521 }, { "id": "s70", "url": "scene2\/images\/ea422cbe7d2beb65f0660a568f89fff9_look.png", "size": 13128 }, { "id": "s73", "url": "scene2\/images\/0c79efa7b1bf38e5fb6f7bc6cdcb3284_look.png", "size": 19254 }, { "id": "s77", "url": "scene2\/images\/e3b322576e41e2014555a265c4f486bf_look.png", "size": 16933 }], "sounds": [{ "id": "s65", "url": "scene2\/sounds\/210dbca1698cf6ae72177dbb60f54f9e_DrumMachine.mpga", "size": 38580 }], "variables": [], "lists": [{ "id": "s1", "name": "list" }], "broadcasts": [{ "id": "s14", "name": "message 1" }, { "id": "s16", "name": "bc msg1" }, { "id": "s17", "name": "bc msg2" }] };