require("dotenv").config();

const express = require("express");
const request =  require("request");
const https =require("https");
const { post } = require("request");

const app = express();
app.use(express.urlencoded({extended:true}));

// for static files 
app.use(express.static("public"));

// console.log("token", process.env.API_KEY);//checking

app.get("/", function(req, res)
{
    res.sendFile(__dirname+"/signup.html");
    // res.send("ok start");
});

app.post("/", function(req, res)
{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us"+process.env.SERVER_NUMBER+".api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;

    const options = {
        method: "POST",
        auth: "vishal1:"+process.env.API_KEY
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode==200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data)
        {
            // console.log(JSON.parse(data));
            // var errorCnt = JSON.parse(data);
            // if(errorCnt.error_count!=0) //my code
            // {
            //     // res.send("kuch to gdbd hai daya!");
            //     res.sendFile(__dirname+"/failure.html");
            // }
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res)
{
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function()
{
    console.log("server started!");
});