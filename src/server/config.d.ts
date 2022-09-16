import { PathOrFileDescriptor } from "fs";

export namespace config {
    const httpsOptions: {
        key: PathOrFileDescriptor,
        cert: PathOrFileDescriptor,
        ca: PathOrFileDescriptor
    };

    /**
     * @default 1620
     */
    let port: number | undefined;
}
export default config;