import { buildPath } from "../Variables/expressServer";

const takeCredentials = async function name(email:string, password:string) {
    try{
        const JSONObj = JSON.stringify({"Email":email,"Password":password});
        console.log("Successfully created a JSON of login "+JSONObj);
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