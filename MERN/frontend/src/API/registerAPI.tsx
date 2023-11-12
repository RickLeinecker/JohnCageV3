import { buildPath } from "../Variables/expressServer";

const register = async function name(userName: string, email: string, password: string, registerFunction: Function) {
    try {
        const JSONObj = JSON.stringify({ "UserName": userName, "Password": password, "Email": email });
        console.log("Successfully created a JSON of new account: " + JSONObj);
        const URL = buildPath("/users/register");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL, { method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' }, body: JSONObj })
        const JSONText = JSON.parse(await response.text());
        if (JSONText.message === "User registered successfully!") {
            localStorage.setItem("Username", userName);
            registerFunction(localStorage.getItem("Username"));
        }
        return response.json;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }
    }
};

export default register;