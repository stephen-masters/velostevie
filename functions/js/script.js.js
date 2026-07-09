// Cloudflare Pages Function — first-party proxy for the Plausible tracking script.
//
// Purpose: serve the Plausible script from velostevie.com's own origin so that
// tracker blocklists (which match on the plausible.io domain) do not block it.
// Requests to /js/script.js are proxied to the site's hashed Plausible script.
//
// Companion function: functions/api/event.js proxies the event beacon.
// Snippet wiring: layouts/partials/head.html points the <script src> at
// /js/script.js and calls plausible.init({endpoint:"/api/event"}).
//
// The upstream hashed URL comes from the Plausible dashboard (Site Settings →
// Installation). It is site-specific — do not reuse scattercode.dev's hash here.
//
// Runs only on Cloudflare Pages in production. hugo server (dev) never emits the
// snippet, so these functions are not exercised locally.

const UPSTREAM_SCRIPT = 'https://plausible.io/js/pa-OvjX9Vo86uvrgAHL-3EkJ.js';

export async function onRequest() {
  const response = await fetch(UPSTREAM_SCRIPT, {
    cf: { cacheTtl: 21600, cacheEverything: true }
  });

  // Copy the upstream response but pin a browser cache header so repeat visits
  // do not re-fetch the script on every page view.
  const proxied = new Response(response.body, response);
  proxied.headers.set('Cache-Control', 'public, max-age=21600, immutable');
  return proxied;
}
