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

export { removeDirectoryFiles };