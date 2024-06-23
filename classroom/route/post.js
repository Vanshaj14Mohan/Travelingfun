const express = require("express");
const router = express.Router();

//FOR POSTS
//INDEX ROUTE ->
router.get("/", (req,res)=>{
    res.send("GET request for posts");
});

//SHOW ROUTE ->
router.get("/:id", (req,res)=>{
    res.send("GET request for post id");
});

//POST ROUTE -> 
router.post("/", (req,res)=>{
    res.send("POST request for posts");
});

//DELETE ROUTE -> 
router.delete("/:id", (req,res)=>{
    res.send("DELETE request for post id");
});

module.exports = router;  