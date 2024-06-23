const express = require("express");
const router = express.Router();

//For USERS:
//INDEX ROUTE -> users
router.get("/", (req,res)=>{
    res.send("GET request for users");
});

//SHOW ROUTE -> users
router.get("/:id", (req,res)=>{
    res.send("GET request for user id");
});

//POST ROUTE -> users
router.post("/", (req,res)=>{
    res.send("POST request for users");
});

//DELETE ROUTE -> users
router.delete("/:id", (req,res)=>{
    res.send("DELETE request for user id");
});

module.exports = router;