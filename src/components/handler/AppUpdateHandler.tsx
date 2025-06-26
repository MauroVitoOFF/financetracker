"use client";

import { useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { toast } from "sonner";

export function AppUpdateHandler() {
  useEffect(() => {
    async function checkUpdates() {
      const update = await check();
      if (update) {
        toast(`Aggiornamento disponibile: v${update.version}`, {
          description: update.body,
          action: {
            label: "Aggiorna ora",
            onClick: async () => {
              update.downloadAndInstall((event) => {
                switch (event.event) {
                  case "Started":
                    toast(`Installazione v${update.version}`, {
                      description: "Riavviando...",
                      duration: 60000,
                    });
                    break;

                  case "Progress":
                    break;

                  case "Finished":
                    break;
                }
              });
              await relaunch();
            },
          },
        });
      }
    }
    checkUpdates();
  }, []);

  return null;
}
