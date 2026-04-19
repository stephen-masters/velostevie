// Adapted from https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/google_analytics.html

{{- if or site.Params.modules.GoogleAnalytics.force (and (not hugo.IsServer) (not site.Config.Privacy.GoogleAnalytics.Disable)) -}}
  {{- with site.Config.Services.GoogleAnalytics.ID -}}
    {{- if site.Params.modules.GoogleAnalytics.gcm }}

window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied", 
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 2000,
});
gtag("set", "ads_data_redaction", true);
gtag("set", "url_passthrough", true);

(function(w, d, s, l, i) {
  w[l] = w[l] || []
  w[l].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
  })
  var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : ''
  j.async = true
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
  {{ if site.Params.modules.GoogleAnalytics.nonce }}
  var n = d.querySelector('[nonce]')
  n && j.setAttribute('nonce', n.nonce || n.getAttribute('nonce'))
  {{ end }}
  f.parentNode.insertBefore(j, f)
})(window, document, 'script', 'dataLayer', '{{ upper (. | urlize) }}')
{{ else }}
var doNotTrack = false;
if ({{ site.Config.Privacy.GoogleAnalytics.RespectDoNotTrack }}) {
  var dnt = (navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack);
  var doNotTrack = (dnt == "1" || dnt == "yes");
}
if (!doNotTrack) {
  const script = document.createElement("script");
  script.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id={{ upper (. | urlize) }}");
  document.body.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '{{ upper . }}');
}
{{- end -}}
{{- end -}}
{{- end -}}