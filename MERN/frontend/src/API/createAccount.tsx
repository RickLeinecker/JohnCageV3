import { buildPath } from "../Variables/expressServer";

const createAccount = async function name(screenName:string,userName:string,email:string, password:string, phoneNum:string) {
    try{
        const JSONObj = JSON.stringify({"Screen Name":screenName,"User Name":userName,"Email":email,"Password":password,"Phone":phoneNum});
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

export default createAccount;