import { PathOrFileDescriptor } from "fs";

export namespace config {
    const httpsOptions: {
        key: PathOrFileDescriptor,
        cert: PathOrFileDescriptor,
        ca: PathOrFileDescriptor
    };
}
export default config;