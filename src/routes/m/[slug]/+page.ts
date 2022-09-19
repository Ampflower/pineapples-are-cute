import { error } from '@sveltejs/kit';
import variables from '$lib/variables';

export const prerender = true;

export async function load( {params, fetch} ) {
    const sid = variables.systemId ? variables.systemId : null;
    if (sid === null)  throw error(500, "If you're the owner of this site, please set the 'VITE_SYSTEM_ID' environment variable!");
    const mid = params.slug;

    let res: any;
    res = await fetch(`https://api.pluralkit.me/v2/members/${mid}`, {
        headers: {
            'origin': 'https://fronters.akarys.me'
            }
    })
    .then(resp => {
        if (resp.status === 404) throw error(404, `Member with id ${mid} does not exist in our system.`);
        if (resp.status === 500) throw error(500, "Internal server error. This is on PluralKit's end.");
        if (resp.status === 429) throw error(500, "PluralKit is rate limiting us! Please try again.")
        if (resp.ok) return resp.json();
        throw error(500, "Internal server error. This this site's fault. Please report it to the developers!");
    });

    if (res.system !== sid) throw error(404, `Member with id ${mid} does not exist in our system.`)

    return await res;
}