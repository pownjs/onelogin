// WARNING: This is an auto-generated file.

exports["oneloginEnumerateGroups"] = {
    "alias": [
        "onelogin_enumerate_groups",
        "onelogin_enum_groups",
        "oleg"
    ],
    "title": "Onelogin Enumerate Groups",
    "description": "Enumerate onelogin groups",
    "group": "Onelogin Enumerate Groups",
    "tags": [
        "ce"
    ],
    "types": [],
    "options": {
        "region": {
            "type": "string",
            "description": "Region for the onelogin endpoint"
        },
        "clientId": {
            "type": "string",
            "description": "The client id for authentication"
        },
        "clientSecret": {
            "type": "string",
            "description": "The client secret for authentication"
        }
    },
    "priority": 1000,
    "noise": 1000
}

exports["oneloginEnumerateGroups"].load = function() { return require("./onelogin")["oneloginEnumerateGroups"] }


exports["oneloginEnumerateRoles"] = {
    "alias": [
        "onelogin_enumerate_roles",
        "onelogin_enum_roles",
        "oler"
    ],
    "title": "Onelogin Enumerate Roles",
    "description": "Enumerate onelogin roles",
    "group": "Onelogin Enumerate Roles",
    "tags": [
        "ce"
    ],
    "types": [],
    "options": {
        "region": {
            "type": "string",
            "description": "Region for the onelogin endpoint"
        },
        "clientId": {
            "type": "string",
            "description": "The client id for authentication"
        },
        "clientSecret": {
            "type": "string",
            "description": "The client secret for authentication"
        },
        "name": {
            "type": "string",
            "description": "Search by name"
        }
    },
    "priority": 1000,
    "noise": 1000
}

exports["oneloginEnumerateRoles"].load = function() { return require("./onelogin")["oneloginEnumerateRoles"] }


exports["oneloginEnumerateApps"] = {
    "alias": [
        "onelogin_enumerate_apps",
        "onelogin_enum_apps",
        "olea"
    ],
    "title": "Onelogin Enumerate Apps",
    "description": "Enumerate onelogin apps",
    "group": "Onelogin Enumerate Apps",
    "tags": [
        "ce"
    ],
    "types": [],
    "options": {
        "region": {
            "type": "string",
            "description": "Region for the onelogin endpoint"
        },
        "clientId": {
            "type": "string",
            "description": "The client id for authentication"
        },
        "clientSecret": {
            "type": "string",
            "description": "The client secret for authentication"
        },
        "name": {
            "type": "string",
            "description": "Search by name"
        },
        "groupById": {
            "type": "boolean",
            "description": "Group results by id",
            "default": false
        }
    },
    "priority": 1000,
    "noise": 1000
}

exports["oneloginEnumerateApps"].load = function() { return require("./onelogin")["oneloginEnumerateApps"] }


exports["oneloginEnumerateUsers"] = {
    "alias": [
        "onelogin_enumerate_users",
        "onelogin_enum_users",
        "oleu"
    ],
    "title": "Onelogin Enumerate Users",
    "description": "Enumerate onelogin users",
    "group": "Onelogin Enumerate Users",
    "tags": [
        "ce"
    ],
    "types": [],
    "options": {
        "region": {
            "type": "string",
            "description": "Region for the onelogin endpoint"
        },
        "clientId": {
            "type": "string",
            "description": "The client id for authentication"
        },
        "clientSecret": {
            "type": "string",
            "description": "The client secret for authentication"
        },
        "email": {
            "type": "string",
            "description": "Search by email"
        },
        "firstname": {
            "type": "string",
            "description": "Search by firstname"
        },
        "lastname": {
            "type": "string",
            "description": "Search by lastname"
        },
        "username": {
            "type": "string",
            "description": "Search by username"
        },
        "createGroups": {
            "type": "boolean",
            "description": "Create group nodes",
            "default": false
        },
        "createDirectories": {
            "type": "boolean",
            "description": "Create directory nodes",
            "default": false
        },
        "createRoles": {
            "type": "boolean",
            "description": "Create roles nodes",
            "default": false
        },
        "createMemberships": {
            "type": "boolean",
            "description": "Create membership nodes",
            "default": true
        },
        "compactMemberships": {
            "type": "boolean",
            "description": "Keep membership compacted",
            "default": false
        }
    },
    "priority": 1000,
    "noise": 1000
}

exports["oneloginEnumerateUsers"].load = function() { return require("./onelogin")["oneloginEnumerateUsers"] }
