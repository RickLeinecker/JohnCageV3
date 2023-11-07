const getEmailOptions = function(email: string, verifyEmailToken: number): any {
    // var ref = "https://www.w3schools.com/";
    // var ref = `http://localhost:5000/api/auth/verify-email-address?verifyEmailToken=${verifyEmailToken}`;
    var ref = `http://localhost:5000/api/verify-email-address/${verifyEmailToken}`;
    // var linkText = "Visit W3Schools.com!"
    var linkText = "Visit JohnCageTribute.org!"
    var options = {
        email: email,
        subject: "Please verify your email",
        text: "Welcome to JohnCageTribute! Please verify your email address by clicking below: href=http://127.0.0.1:5000/verify-email-address?token=[emailToken]",
        html: "<h1>Welcome to JohnCageTribute!</h1> <p>Please verify your email address by clicking below:" + `<a href=${ref}>${linkText}</a>` + "</p>"
    }

    return options;
};

export default getEmailOptions;