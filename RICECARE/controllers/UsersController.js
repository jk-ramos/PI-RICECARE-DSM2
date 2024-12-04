import express from "express";
const router =  express.Router();
import User from "../models/User.js";

router.get("/login", (req, res) => {
    res.render("login");
});

//ROTA DE AUTENTICAÇÃO
router.post("/authenticate", (req, res) => {
    const email = req.body.email;
    const password = req.bodi.password;

    User.findOne({
        where:{
            email:email
        },
    }).then(user =>{
        if(user != undefined){
            res.redirect("/");

        }else{
            res.send(`Usuário não cadastrado. <a href="/login">Tente novamente! `);
        }
    })    

})



export default router;


