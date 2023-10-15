import { buildPath } from "../Variables/expressServer";

const LoginAPI = async function name(email:string, password:string) {
    try{
        const JSONObj = JSON.stringify({"username":email,"password":password});
        console.log("Successfully created a JSON of login "+JSONObj);
        const URL = buildPath("/users/login");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL,{ method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' },body: JSONObj })
        const JSONRes = JSON.parse(await response.text());
        console.log("Response: ",JSONRes);
        console.log("Storing token: "+JSONRes.token);
        localStorage.setItem("AuthToken",JSONRes.token);
        return JSONRes;
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