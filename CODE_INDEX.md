# FrameBaseCSS code index

Mappa tecnica compatta del progetto. I percorsi sono relativi alla root.

## Sorgenti

| Percorso | Ruolo | Contenuto e relazioni |
| --- | --- | --- |
| `framebase.css` | Sorgente canonica e contratto pubblico | Design system dark monospace senza dipendenze. Definisce token `--fb-*`, layout e componenti `.fb-*`, utility `.u-*` e mantiene le classi documentali preesistenti (`.doc-*`, `.card`, `.badge`, `.callout`, `.code-*`, `.gallery*`). È consumato direttamente da `framebase-demo.html`. |
| `framebase-demo.html` | Demo e verifica manuale | Pagina HTML offline che usa esclusivamente `framebase.css`. Mostra shell di sito pubblico, hero, navigazione, card, feedback, form, controlli HTML nativi, tabelle, codice, media inline e layout documentazione a più colonne. |

## Riferimenti conservati

| Percorso | Ruolo | Contenuto e relazioni |
| --- | --- | --- |
| `codex-document-master-final.css` | Base originale, non modificata | Foglio CSS documentale da cui derivano palette, tipografia, classi compatibili e componenti tecnici. Non è caricato dalla demo e resta disponibile per confronto storico. |

## Struttura di `framebase.css`

1. Design token e alias di compatibilità.
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
