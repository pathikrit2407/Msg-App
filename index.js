const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')

const port = process.env.PORT || 3000

const app = express()


//Templete engine setup
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));

//bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Use the session middleware
app.use(session({ 
    secret: 'keyboard cat', 
    resave: true,
    saveUninitialized:true
}))

//flash
app.use(flash())

//Global Vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//========ROUTES=============
app.get('/',(req,res)=>{
    res.render('welcome.ejs')
})

app.get('/message',(req,res) => {
    res.render('main.ejs')
})

app.post('/message',(req,res) => { 
    console.log(req.body)
   
    const phone = req.body.phone

    const msg = req.body.msg
    
    const messages = [];
    
    if(phone.length==12){
        const Nexmo = require('nexmo');

        const nexmo = new Nexmo({
          apiKey: '58d2f910',
          apiSecret: '6ld2rFbLSE5pCo5t',
        },{debug:true});
        
        const from = 'MY SMS API';
        const to = phone;
        const text = msg;
       
        nexmo.message.sendSms(from, to, text ,(err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                req.flash('success_msg','Message sent successfully')
                 res.redirect('/message')
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                    console.log(responseData.messages[0]['status'] )
                    req.flash('error_msg','Something went Wrong .Try Again !')
                    res.redirect('/message')
                }
            }
        })

        // messages.push({msg:"Message Successfully Send !"})
        // console.log(messages)
        // res.render('main.ejs',{messages})

        // req.flash('success_msg','Message sent successfully')
        // res.redirect('/message')

    }else{
        // messages.push({msg:"Enter a valid Number . Try Again !"})
        // console.log(messages)
        // res.render('main.ejs',{messages})
        req.flash('error_msg','Enter a valid Number . Try Again !')
        res.redirect('/message')
    }
})

app.listen(port ,()=>{
    console.log("Server listening on port "+port)
})



