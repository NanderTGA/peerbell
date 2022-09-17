// client 2 for testing (sends a request to client 1's exposed port)
// run in browser (run in devtools or in an async function)

/** Address of client 1 */
const client1Address = "";

// incase you have your own static address details, put them in these 2 variables
// but do note you can't use one address in multiple places at the same time
const username: string | undefined = undefined;
const password: string | undefined = undefined;

// connect
const socket = (await import("https://cdn.socket.io/4.5.1/socket.io.esm.min.js")).io("https://nandertga.ddns.net:1620", {
    withCredentials: true
});

// get address
socket.emit("ready", username, password, data => console.log("response to ready event:", data)); //TODO add error handling

// req test
socket.once("response", (port, data) => console.log("repsonse", port, data) )

socket.emit("request", client1Address, 69, "hello", (reqID, error) => {
    console.log(reqID, error);
});