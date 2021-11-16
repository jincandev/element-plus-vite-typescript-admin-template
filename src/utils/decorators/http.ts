import request from "../request";

export const Get = (url: string, headers: any = {}) => {
    return (target: any, key: string) => {
        const _fn = target[key]
        target[key] = async function(params: any = {}, subHeaders: any = {}) {
            const req_headers = {
                ...headers,
                ...subHeaders
            }
            const result = await _fn.call(target, params, req_headers)
            let targetUrl = url;
            if(url.indexOf("}") > url.indexOf("{")) {
                targetUrl = targetUrl.replace(/\{([^}]+)\}/ig, (group: any, $1: string) => {
                    return result?.__params?.[$1] ?? result?.[$1] ?? group
                })
            }
            if(typeof params === "string") {
                const sep = targetUrl.indexOf("?") > -1 ? "&" : "?"
                targetUrl += sep + params
                params = {}
            }
            if(result?.__query) {
                params = Object.assign(params, result.__query)
            }
            return request({
                url: targetUrl,
                params,
                headers: req_headers
            })
        }
        return target
    }
}

export const Post = (url: string, headers: any = {}) => {
    return (target: any, key: string) => {
        const _fn = target[key]
        target[key] = async function(body: any = {}, subHeaders: any = {}) {
            const req_headers = {
                ...headers,
                ...subHeaders
            }
            const result = await _fn.call(target, body, req_headers)
            let targetUrl = url;
            if(url.indexOf("}") > url.indexOf("{")) {
                targetUrl = targetUrl.replace(/\{([^}]+)\}/ig, (group: any, $1: string) => {
                    return result?.__params?.[$1] ?? result?.[$1] ?? group
                })
            }
            let params = {}
            if(result?.__query) {
                params = Object.assign(params, result.__query)
            }
            if(result?.__body) {
                body = Object.assign(body, result.__body)
            }
            return request({
                url: targetUrl,
                params,
                data: body,
                headers: req_headers
            })
        }
        return target
    }
}
