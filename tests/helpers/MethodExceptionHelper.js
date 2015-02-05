function MethodExceptionHelper(classInstance, className, methodName, arguments) {
    if (!classInstance || (classInstance.constructor !== Object && classInstance.constructor !== Function)) {
        throw new Error("[MethodExceptionHelper] classInstance is missing or is not an object or a function");
    }
    if (!className || className.constructor !== String) {
        throw new Error("[MethodExceptionHelper] className is missing or is not a string");
    }
    if (!methodName || methodName.constructor !== String) {
        throw new Error("[MethodExceptionHelper] methodName is missing or is not a string");
    }
    if (!arguments || arguments.constructor !== Array) {
        throw new Error("[MethodExceptionHelper] arguments is missing or is not an array");
    }

    var testValues = {
        "null": null,
        "string": "string",
        "int": 1,
        "bool": true,
        "object": {},
        "array": [],
        "function": function() {
        },
        "undefined": undefined,
        "NaN": NaN

    };
    var argumentsString = "";
    for (var j = 0; j < arguments.length; j++) {
        for (var param in arguments[j]) {
            argumentsString += param + ":" + arguments[j][param] + ", ";
        }
    }
    argumentsString = argumentsString.substring(0, argumentsString.length - 2);
    //TEST CALL WITHOUT PARAMS
    throws(function() {
        classInstance[methodName]();
    }, Error, "[" + className + "." + methodName + "] arguments: ( " + argumentsString + " )");

    var goodArguments = [];
    for (var i = 0; i < arguments.length; i++) {
        for (var param in arguments[i]) {
            goodArguments[i] = testValues[arguments[i][param]];
        }
    }

    //ITERATE OVER PARAMETERS AND TRY ALL TEST INPUT VALUES
    for (var i = 0; i < arguments.length; i++) {
        var callArguments = [];

        //SETUP CALL ARGUMENTS
        for (var k = 0; k < goodArguments.length; k++) {
            callArguments[k] = goodArguments[k];
        }

        //CHECK ALL OTHER VALUES
        for (var testVal in testValues) {
            for (var e in arguments[i]) {
                if (arguments[i][e] !== testVal) {
                    callArguments[i] = testValues[testVal];

                    throws(function() {
                        classInstance[methodName].apply(classInstance, callArguments);
                    }, Error, "[" + className + "." + methodName + "] " + e + " argument must be a " + arguments[i][e] + ", " + testVal + " given");

                }

            }
        }
    }
}