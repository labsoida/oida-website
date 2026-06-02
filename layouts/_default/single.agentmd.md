---
# Markdown version per AI agents — generata da Hugo
# Vedi link rel="alternate" type="text/markdown" sulla versione HTML
---

# {{ .Title }}

{{ with .Description }}> {{ . }}

{{ end -}}
{{ if and .Date (gt .Date.Year 1) }}**Data:** {{ .Date.Format "2006-01-02" }}{{ end }}
{{- with .Params.author }}
**Autore:** {{ . }}{{ end -}}
{{- with .Params.kicker }}
**Categoria:** {{ . }}{{ end -}}
{{- with .Params.base }}
**Base empirica:** {{ . }}{{ end -}}
{{- with .Params.tags }}
**Tag:** {{ delimit . ", " }}{{ end }}

---

{{ .RawContent }}

---

**Fonte:** {{ .Permalink }}
**Sito:** https://oida-labs.com — OIDA Labs Sagl, Piazza dell'Indipendenza 3, 6900 Lugano (CH)
**Knowledge base completa:** https://oida-labs.com/llms-full.txt
**Manifest agent:** https://oida-labs.com/.well-known/ai-plugin.json
