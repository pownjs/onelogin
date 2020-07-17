const querystring = require('querystring')
const { Scheduler } = require('@pown/request/lib/scheduler')

class Client {
    constructor(options) {
        const { scheduler = new Scheduler() } = options || {}

        this.scheduler = scheduler
    }

    async authenticate({ region, clientId, clientSecret }) {
        if (!region) {
            throw new Error(`Option region not specified`)
        }

        if (!clientId) {
            throw new Error(`Option clientId not specified`)
        }

        if (!clientSecret) {
            throw new Error(`Option clientSecrets not specified`)
        }

        if (!this.accessToken) {
            const { responseCode, responseBody } = await this.scheduler.request({
                method: 'POST',
                uri: `https://api.${region}.onelogin.com/auth/oauth2/v2/token`,
                headers: {
                    'Authorization': `client_id:${clientId}, client_secret:${clientSecret}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'client_credentials'
                })
            })

            if (responseCode != 200) {
                throw new Error(`Authentication failure`)
            }

            const { access_token: accessToken, expires_in: expiresIn } = JSON.parse(responseBody)

            if (!accessToken) {
                throw new Error(`Authentication failure`)
            }

            this.accessToken = accessToken

            this.expires = Date.now() + expiresIn
        }

        if (Date.now() > this.expires) {
            delete this.accessToken

            await this.authenticate({ region, clientId, clientSecret })
        }
    }

    async * query({ region, clientId, clientSecret, path, query, paginate = false }) {
        if (!path) {
            throw new Error(`Option path not specified`)
        }

        const search = querystring.stringify({ ...query })

        let nextLink = `https://api.${region}.onelogin.com/api/1/${path}?${search}`

        for (;;) {
            await this.authenticate({ region, clientId, clientSecret })

            const { responseCode, responseHeaders, responseBody } = await this.scheduler.request({
                method: 'GET',
                uri: nextLink,
                headers: {
                    'Authorization': `bearer:${this.accessToken}`
                }
            })

            if (responseCode == 401) {
                throw new Error(`Authentication failure`)
            }

            if (responseCode != 200) {
                break
            }

            const { pagination, data } = JSON.parse(responseBody)

            yield* data

            if (paginate) {
                const { next_link } = pagination || {}

                if (next_link) {
                    nextLink = next_link
                }
                else {
                    break
                }
            }
            else {
                break
            }
        }
    }
}

module.exports = {
    Client
}
