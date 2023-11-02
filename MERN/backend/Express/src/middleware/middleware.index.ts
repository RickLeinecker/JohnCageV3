import { verifyToken } from "./middleware.extractJWT"
import { verifyRegister } from "./middleware.verifyRegister"

// Export ALL middleware functions to make them importable, then callable in any file.
export const Middleware = {
    verifyToken,
    verifyRegister
}