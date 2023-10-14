import { buildPath } from "../Variables/expressServer";

const LoginAPI = async function name(email:string, password:string) {
    try{
        const JSONObj = JSON.stringify({"username":email,"password":password});
        console.log("Successfully created a JSON of login "+JSONObj);
        const URL = buildPath("/users/login");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL,{ method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' },body: JSONObj })
        console.log(JSON.parse(await response.text()));
        return response.json;
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