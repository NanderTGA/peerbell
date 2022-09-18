// client 1 for testing (has an exposed port)
// run in browser (run in devtools or in an async function)

// incase you have your own static address details, put them in these 2 variables
// but do note you can't use one address in multiple places at the same time
const username: string | undefined = undefined;
const password: string | undefined = undefined;

// connect
const socket = (await import("https://cdn.socket.io/4.5.1/socket.io.esm.min.js")).io("https://nandertga.ddns.net:1620", {
    withCredentials: true
});

socket.emit("ready", username, password, data => {
    if (data.error) return console.error(data.error);
    console.log(data.address);
    
    socket.emit("get services", services => console.log("services:", services));
    
    socket.emit("get address", address => console.log("address:", address));
    
    socket.emit("expose", 69, "test service", "a test service", (success, error) => {
        console.log("success?", success || "fail ¯\\_(ツ)_/¯");
        console.log("error?", error || "no error :)");
        if (!error && success) socket.on("request", (address, port, data, reqID) => {
            console.log("req from", `${address}:${port}`, "data", data, "reqID:", reqID);
            if (data == "hello") return socket.emit("response", reqID, "hello back");
            return socket.emit("response", reqID, "you didn't say hello you asshole");
        });
        else console.error("uhhh yeah we couldn't expose the port I'm sorry");
        socket.emit("get services", console.log);
    });
});