// Backwards-compat shim: delegate to the plural `messages` route.
export { GET, POST } from "../messages/route";

// Note: keeping this file avoids a build-time validator error when
// something references `/api/message`. Prefer using `/api/messages`.
