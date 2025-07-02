# 💰 FinanceTracker – Gestione delle Finanze Personali

FinanceTracker è un'applicazione desktop e mobile **multipiattaforma**, sviluppata con [Tauri](https://tauri.app/) e [React/Next.js](https://nextjs.org/), progettata per aiutarti a gestire in modo semplice, veloce ed elegante le tue finanze personali.

---

## 🚀 Funzionalità principali

- ✅ Aggiunta di **transazioni** (entrate/spese) con importo, data, descrizione e categoria
- 📊 Dashboard con **statistiche**, **saldo**, grafici e transazioni recenti
- 🔎 Filtro per testo, tipo e data
- ✏️ Modifica/eliminazione rapida tramite **modal dettagliato** o tasto destro
- 🎨 Gestione categorie personalizzate con **icone e colori**
- 💾 **Persistenza dei dati** in SQLite (via plugin Tauri)
- 🔁 **Transazioni ricorrenti** con frequenze settimanali, mensili, trimestrali o annuali
- 💳 **Gestione abbonamenti** con creazione automatica delle scadenze e rinnovo
- 📁 Esportazione/importazione CSV (in arrivo)
- 🌍 Supporto a localizzazione e accessibilità (in sviluppo)

---

## 🛠️ Tecnologie utilizzate

| Tecnica         | Dettagli |
|-----------------|----------|
| **Frontend**    | [React](https://react.dev/) + [Next.js](https://nextjs.org/) |
| **UI**          | [shadcn/ui](https://ui.shadcn.com/) (Dialog, Button, Calendar, Tabs...) |
| **Database**    | [SQLite](https://sqlite.org/) via `@tauri-apps/plugin-sql` |
| **Icone**       | [Lucide](https://lucide.dev/) |
| **Stato**       | [Zustand](https://zustand-demo.pmnd.rs/) *(o Context API)* |
| **Date utils**  | [date-fns](https://date-fns.org/) |
| **Desktop App** | [Tauri](https://tauri.app/) |

---

## 📷 Screenshot

> *(Aggiungi qui eventuali immagini/gif animate della dashboard, transazioni, modal, etc.)*

---

## 📦 Installazione e sviluppo

### 🖥️ Prerequisiti

- Node.js `>=18`
- pnpm / npm / yarn
- Rust toolchain (per compilare Tauri)
- SQLite

### 🧪 Setup locale

```bash
# 1. Clona la repo
git clone https://github.com/tuo-username/finance-tracker.git
cd finance-tracker

# 2. Installa le dipendenze
pnpm install

# 3. Avvia in modalità dev
pnpm dev