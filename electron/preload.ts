// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";

import { dataProvider as SQLite } from "../packages/sqlite/dataProvider";
import { SQLite as SQLite_legacy } from "../packages/sqlite/sqlite"
import path from "path";

/**
 * TO DO:
 * 
 * Refactor this module and remove unnecessary APIs
 */


contextBridge.exposeInMainWorld("API", {
    SQLite, SQLite_legacy, path
});

contextBridge.exposeInMainWorld("ENV", {
    rootPath: __dirname
})


declare global {
    interface Window {
        API: {
            SQLite: typeof SQLite;
            SQLite_legacy: typeof SQLite_legacy;
            path: typeof path;
        };
        ENV: {
            rootPath: string;
        }
    }
}
