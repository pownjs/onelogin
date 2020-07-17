const { Transform } = require('@pown/recon/lib/transform')
const { Scheduler } = require('@pown/recon/lib/scheduler')

const { Client } = require('../../lib/onelogin')

const GROUP_TYPE = 'onelogin:group'
const DIRECTORY_TYPE = 'onelogin:directory'
const ROLE_TYPE = 'onelogin:role'
const MEMBERSHIP_TYPE = 'onelogin:membership'
const APP_TYPE = 'onelogin:app'
const USER_TYPE = 'onelogin:user'

const scheduler = new Scheduler()

class OneloginTransform extends Transform {
    constructor(...args) {
        super(...args)

        this.client = new Client({ scheduler })
    }
}

const commonOptions = {
    region: {
        type: 'string',
        description: 'Region for the onelogin endpoint'
    },

    clientId: {
        type: 'string',
        description: 'The client id for authentication'
    },

    clientSecret: {
        type: 'string',
        description: 'The client secret for authentication'
    }
}

const oneloginEnumerateGroups = class extends OneloginTransform {
    static get alias() {
        return ['onelogin_enumerate_groups', 'onelogin_enum_groups', 'oleg']
    }

    static get title() {
        return 'Onelogin Enumerate Groups'
    }

    static get description() {
        return 'Enumerate onelogin groups'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return []
    }

    static get options() {
        return {
            ...commonOptions
        }
    }

    static get priority() {
        return 1000
    }

    static get noise() {
        return 1000
    }

    async handle({ id: source = '', label = '' }, options) {
        const { region, clientId, clientSecret } = options

        const results = []

        for await (let group of this.client.query({ paginate: true, region, clientId, clientSecret, path: 'groups' })) {
            const { id, name } = group

            const groupNodeId = this.makeId(GROUP_TYPE, id)

            results.push({ type: GROUP_TYPE, id: groupNodeId, label: name, props: { ...group }, edges: [source] })
        }

        return results
    }
}

const oneloginEnumerateRoles = class extends OneloginTransform {
    static get alias() {
        return ['onelogin_enumerate_roles', 'onelogin_enum_roles', 'oler']
    }

    static get title() {
        return 'Onelogin Enumerate Roles'
    }

    static get description() {
        return 'Enumerate onelogin roles'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return []
    }

    static get options() {
        return {
            ...commonOptions
        }
    }

    static get priority() {
        return 1000
    }

    static get noise() {
        return 1000
    }

    async handle({ id: source = '', label = '' }, options) {
        const { region, clientId, clientSecret } = options

        const results = []

        for await (let role of this.client.query({ paginate: true, region, clientId, clientSecret, path: 'roles' })) {
            const { id, name } = role

            const roleNodeId = this.makeId(ROLE_TYPE, id)

            results.push({ type: ROLE_TYPE, id: roleNodeId, label: name, props: { ...role }, edges: [source] })
        }

        return results
    }
}

const oneloginEnumerateApps = class extends OneloginTransform {
    static get alias() {
        return ['onelogin_enumerate_apps', 'onelogin_enum_apps', 'olea']
    }

    static get title() {
        return 'Onelogin Enumerate Apps'
    }

    static get description() {
        return 'Enumerate onelogin apps'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return []
    }

    static get options() {
        return {
            ...commonOptions
        }
    }

    static get priority() {
        return 1000
    }

    static get noise() {
        return 1000
    }

    async handle({ id: source = '', label = '', type, props }, options) {
        const { region, clientId, clientSecret } = options

        const results = []

        for await (let app of this.client.query({ paginate: true, region, clientId, clientSecret, path: `users/${type === USER_TYPE ? props.id : label}/apps` })) {
            const { id, name, icon } = app

            const appNodeId = this.makeId(APP_TYPE, name)

            const image = (/^https?:\/\//i.test(icon) ? icon : ` https://cdn.onelogin.com${icon}`).trim()

            results.push({ type: APP_TYPE, id: appNodeId, label: name, image, props: { ...app, icon: image }, edges: [source] })
        }

        return results
    }
}

const oneloginEnumerateUsers = class extends OneloginTransform {
    static get alias() {
        return ['onelogin_enumerate_users', 'onelogin_enum_users', 'oleu']
    }

    static get title() {
        return 'Onelogin Enumerate Users'
    }

    static get description() {
        return 'Enumerate onelogin users'
    }

    static get group() {
        return this.title
    }

    static get tags() {
        return ['ce']
    }

    static get types() {
        return []
    }

    static get options() {
        return {
            ...commonOptions,

            email: {
                type: 'string',
                description: 'Search by email'
            },

            firstname: {
                type: 'string',
                description: 'Search by firstname'
            },

            lastname: {
                type: 'string',
                description: 'Search by lastname'
            },

            username: {
                type: 'string',
                description: 'Search by username'
            }
        }
    }

    static get priority() {
        return 1000
    }

    static get noise() {
        return 1000
    }

    async handle({ id: source = '', label = '' }, options) {
        const { region, clientId, clientSecret, email, firstname, lastname, username } = options

        const results = []

        for await (let user of this.client.query({ paginate: true, region, clientId, clientSecret, path: 'users', query: { email, firstname, lastname, username } })) {
            const { group_id, directory_id, role_id, member_of, id, email } = user

            const groupId = group_id || '[None]'
            const directoryId = directory_id || '[None]'
            const roleId = role_id || []
            const memberOf = member_of || ''

            const groupNodeId = this.makeId(GROUP_TYPE, groupId)
            const directoryNodeId = this.makeId(DIRECTORY_TYPE, directoryId)

            results.push({ type: GROUP_TYPE, id: groupNodeId, label: groupId, props: { id: groupId }, edges: [source] })
            results.push({ type: DIRECTORY_TYPE, id: directoryNodeId, label: directoryId, props: { id: directoryId }, edges: [source] })

            const roleNodeIds = []; // WTF???

            roleId.forEach((roleId) => {
                const roleNodeId = this.makeId(ROLE_TYPE, roleId)

                results.push({ type: ROLE_TYPE, id: roleNodeId, label: roleId, props: { id: roleId }, edges: [source] })

                roleNodeIds.push(roleNodeId)
            })

            const memberNodeIds = []; // WTF???

            memberOf.split(';').map(t => t.trim()).filter(t => t).forEach((membership) => {
                const membershipNodeId = this.makeId(MEMBERSHIP_TYPE, membership)

                results.push({ type: MEMBERSHIP_TYPE, id: membershipNodeId, label: membership, props: { membership }, edges: [source] })

                memberNodeIds.push(id)
            })

            const userNodeId = this.makeId(USER_TYPE, id, email)

            results.push({ type: USER_TYPE, id: userNodeId, label: email, props: { ...user }, edges: [groupNodeId, directoryNodeId, ...roleNodeIds, ...memberNodeIds] })
        }

        return results
    }
}

module.exports = {
    oneloginEnumerateGroups,
    oneloginEnumerateRoles,
    oneloginEnumerateApps,
    oneloginEnumerateUsers
}
