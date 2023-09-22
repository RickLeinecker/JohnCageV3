import cors, { CorsOptions } from "cors";
import express, { Application } from "express";

class socketServer {
    constructor(app: Application) {
    }

    private config(app: Application): void {
        const corsOptions: CorsOptions = {
            origin: "*"//Fix using env variable.
        };
    }

    private syncDatabase(): void {
    }
}

export default socketServer;