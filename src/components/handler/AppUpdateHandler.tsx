import { useEffect } from "react";
import * as tauriUpdater from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { toast } from "sonner";

export function AppUpdateHandler() {
  useEffect(() => {
    async function checkUpdates() {
      const update = await tauriUpdater.check();
      if (update?.version) {
        toast(`Aggiornamento disponibile: v${update.version}`, {
          description: update.body,
          action: {
            label: "Aggiorna ora",
            onClick: () => {
              update.downloadAndInstall((event) => {
                switch (event.event) {
                  case "Started":
                    toast(`Installazione v${update.version}`, {
                      description: "Preparando il riavvio...",
                      duration: 60000,
                    });
                    break;

                  case "Progress":
                    break;

                  case "Finished":
                    relaunch();
                }
              });
            },
          },
        });
      }
    }
    checkUpdates();
  }, []);

  return null;
}
