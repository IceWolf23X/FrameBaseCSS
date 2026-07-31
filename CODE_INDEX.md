# FrameBaseCSS code index

Mappa tecnica compatta del progetto. I percorsi sono relativi alla root.

## Sorgenti

| Percorso | Ruolo | Contenuto e relazioni |
| --- | --- | --- |
| `framebase.css` | Sorgente canonica e contratto pubblico | Design system dark monospace senza dipendenze. Definisce token `--fb-*`, layout e componenti `.fb-*` e utility `.u-*` con un unico contratto namespaced. È consumato direttamente da `framebase-demo.html`. |
| `framebase-demo.html` | Documentazione pubblica e verifica manuale | Pagina HTML offline che usa esclusivamente `framebase.css`. Documenta i contratti HTML pubblici e mostra gli stessi componenti in esempi realistici: sito pubblico, dashboard, contenuto editoriale, form, dati, codice, media e documentazione tecnica responsive. |
| `README.md` | Entrypoint pubblico | Presenta obiettivi, quick start, percorso della documentazione, personalizzazione, requisiti browser e mappa dei file pubblici. |

## Struttura di `framebase.css`

1. Design token.
2. Reset, ereditarietà e base documento.
3. Tipografia.
4. Layout generali.
5. Shell di sito e navigazione.
6. Pagine pubbliche.
7. Layout documentazione.
8. Componenti di contenuto e azione.
9. Form e controlli HTML nativi.
10. Feedback, dati, codice e media.
11. Navigazione secondaria e utility.
12. Responsive, preferenze utente e stampa.

## Esclusioni

Non sono presenti dipendenze, output di build, file generati, asset binari o
alberi vendorizzati. Gli SVG dimostrativi sono incorporati direttamente nella
demo per preservarne il funzionamento offline.
