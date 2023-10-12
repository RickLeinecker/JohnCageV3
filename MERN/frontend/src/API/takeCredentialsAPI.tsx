import { buildPath } from "../Variables/expressServer";

const takeCredentials = async function name(email:string, password:string) {
    try{
        const JSONObj = JSON.stringify({"Email":email,"Password":password});
        console.log("Successfully created a JSON of login "+JSONObj);
        const URL = buildPath("/users/login");
        console.log("Fetch request URL:", URL);
        const response = await fetch(URL,{ method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' },body: JSONObj })
        console.log("Response "+response.json);
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

export default takeCredentials;