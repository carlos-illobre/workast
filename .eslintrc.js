module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "jasmine": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            { "MemberExpression": 0 }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "no-unused-vars": [
            "error", {
                "args": "none"
            }
        ],
        "no-var": [
            "error"
        ],
        "prefer-const": [
            "error"
        ],
        "promise/catch-or-return": [
            "error"
        ],
        "promise/no-return-wrap": [
            "error"
        ],
        "promise/param-names": [
            "error"
        ],
        "promise/no-nesting": [
            "error"
        ],
        "promise/no-promise-in-callback": [
            "error"
        ],
        "promise/no-return-in-finally": [
            "error"
        ],

    },
    "plugins": [
        "promise"
    ]
}
