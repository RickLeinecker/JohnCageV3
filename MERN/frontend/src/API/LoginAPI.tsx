import { buildPath } from "../Variables/expressServer";

const LoginAPI = async function name(email:string, password:string, loginFunction:Function) {
    try{
        const JSONObj = JSON.stringify({"username":email,"password":password});
        console.log("Successfully created a JSON of login "+JSONObj);
        const URL = buildPath("/users/login");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL,{ method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' },body: JSONObj })
        const JSONText = JSON.parse(await response.text());
        if (JSONText.message === "Some error occurred while logging in a user.")
            console.log("Login Failed")
        else
        {
            console.log("Logging in successeful. Welcome ",JSONText.user.UserName);
            localStorage.setItem("Username",JSONText.user.UserName);
            loginFunction(localStorage.getItem("Username"));
        }
        console.log(JSONText);
        return JSONText;
    }
    catch(e)
    {
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }
    }
};

export default LoginAPI;