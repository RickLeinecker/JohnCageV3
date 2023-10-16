import { buildPath } from "../Variables/expressServer";

const register = async function name(screenName: string, userName: string, email: string, password: string, phoneNum: string) {
    try {
        const JSONObj = JSON.stringify({ "Name": screenName, "UserName": userName, "Password": password, "Email": email, "Phone": phoneNum });
        console.log("Successfully created a JSON of new account: " + JSONObj);
        const URL = buildPath("/users/register");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL, { method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' }, body: JSONObj })
        console.log(JSON.parse(await response.text()));
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