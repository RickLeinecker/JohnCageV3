import { Dirent } from "fs";
import console_log from "./logging/console_log";

const fs = require("fs");

const removeDirectoryFiles = function (directoryPath: string) {
    fs.readdir(directoryPath, { withFileTypes: true }, (err: any, files: Dirent[]) => {
        if (err) { console_log("Error: ", err, "\n") }
        else {
            for (const file of files) {
                if (file.isFile()) {
                    fs.unlink(directoryPath + file.name, (err: any) => {
                        if (err) { console_log("Error: ", err, "\n") };
                    });
                }
            }
        };
    });
}

const writeFileForce = function (path: string, file: string, data: any) {

    if (!fs.existsSync(path)) { fs.mkdirSync(path, { recursive: true }); }

    fs.writeFile(path + file, data, (e: any) => {
        if (e) { console_log("Error: ", e, "\n"); }
    });
}

export { removeDirectoryFiles, writeFileForce };