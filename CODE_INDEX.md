# FrameBaseCSS code index

Mappa tecnica compatta del progetto. I percorsi sono relativi alla root.

## Sorgenti

| Percorso | Ruolo | Contenuto e relazioni |
| --- | --- | --- |
| `framebase.css` | Sorgente canonica e contratto pubblico | Design system monospace senza dipendenze con tema dark predefinito. Definisce token `--fb-*`, layout e componenti `.fb-*` e utility `.u-*` con un unico contratto namespaced. È consumato direttamente dalla documentazione e importato dal tema light. |
| `framebase-light.css` | Override ufficiale del tema | Importa `framebase.css` e ridefinisce esclusivamente schema colore, palette semantica e ombre. Non duplica regole di componenti o layout. |
| `index.html` | Homepage GitHub Pages e verifica dark | Entrypoint statico pubblico che usa esclusivamente `framebase.css`. Documenta i contratti HTML pubblici e mostra gli stessi componenti in esempi realistici: sito pubblico, dashboard, contenuto editoriale, form, dati, codice, media e documentazione tecnica responsive. |
| `framebase-light-demo.html` | Verifica manuale light | Copia strutturalmente identica di `index.html`; l’unica differenza ammessa è il collegamento a `framebase-light.css`, così ogni componente viene verificato senza markup specifico del tema. |
| `.nojekyll` | Configurazione GitHub Pages | Disabilita la trasformazione Jekyll e pubblica direttamente gli asset statici presenti nella root di `main`. |
| `README.md` | Entrypoint pubblico | Presenta obiettivi, quick start, temi ufficiali, percorso della documentazione, personalizzazione, requisiti browser e mappa dei file pubblici. |

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
