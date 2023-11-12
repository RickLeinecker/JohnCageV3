import { buildPath } from "../Variables/expressServer";


const ResetPassword = async function(emailAddress: string): Promise<void> {
    try {
        const URL = buildPath('/users/forgot-password');
        console.log("URL: " + URL);
        const JSONObj = JSON.stringify({emailAddress: emailAddress});
        console.log("JSONObj: " + JSONObj);
        const response = await fetch(URL, { method: 'POST', mode: "cors", headers: { 'Content-Type': 'application/json' }, body: JSONObj})
        const JSONText = JSON.parse(await response.text());
        console.log("JSONText" + JSONText);
        return JSONText;
    }
    catch (e) {
        console.log(e);
        if (e instanceof Error) {
            console.error(e.toString());
        }
        else {
            console.error(e);
        }
    }
};

export default ResetPassword;