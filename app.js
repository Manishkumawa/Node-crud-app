const express = require('express');
const port = 3000;
const app = express();

const mongoose = require('mongoose');
const User  =require('./models/user');

const dburl =  'mongodb://127.0.0.1:27017/User';
mongoose.connect(dburl ,{useNewUrlParser:true ,useUnifiedTopology:true})
.then((result) =>{console.log("database connected"); app.listen(3000)})
.catch(err =>console.log(err));


app.set('view engine' ,'ejs');

//static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.redirect('/users');
});
app.get('/users',(req,res)=>{
    console.log("req made on " + req.url);
    User.find().sort({createdAt :-1})
    .then(result =>{
        res.render('index' ,{users:result , title:'Home'});
    })
    .catch(err =>{
        console.logI
    });

});
//about
app.get('/about',(req,res)=>{
    console.log("req made on " + req.url);
    res.render('about',{title:'About'});
});

//route for user create 
app.get('/user/create',(req,res)=>{
    console.log("Get req made on " +req.url);
    res.render('adduser',{title: 'Add -User'});

});

//route for users withvar 
app.get('/users/:id',(req,res)=>{
    const id  =req.params.id;
    User.findById(id)
    .then(result =>{
        res.render('details',{users:result ,action:'edit',title :'User Details'});
    })
    .catch(err =>{
        console.log(err);
    });
});

//route for edit name action 
app.get('/edit/:name/:action',(req,res)=>{
    const name = req.params.name;
    console.log("req made on " +req.url);
    User.findOne({name :name})
    .then(result =>{
        res.render('edit' ,{user :result ,title :'Edit -User'});
    })
    .catch(err =>{
        console.log(err);


    });

});
//submiiting the routes

app.post('/user/create',(req,res)=>{
    const user = new User(req.body);
    user.save()
    .then(result =>{
        res.redirect('/users');
    })
    .catch(err =>{
        console.log(err);
    })
})

//route for updating the users data
app.post('/edit/:id',(req,res)=>{

    User.updateOne({_id:req.params.id} ,req.body)
    .then(result =>{
        res.redirect('/users');
        console.log("User profile updated");

    })
    .catch(err =>{
        console.log(err);
    })
})
//routes for deleting users by get
app.post('/users/:name' ,(req,res)=>{
    const name = req.params.name;

    User.deleteOne({name:name})
    .then(result =>{
        res.redirect('/users');
    })
    .catch(err =>{
        console.log(err);
    })
})

app.use((req,res)=>{
    res.render('404',{title:'NotFound'});
})

app.listen(port ,(req,res)=>{
    console.log("app is working ");
});