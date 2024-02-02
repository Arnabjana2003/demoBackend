import express from "express"

const app = express()

app.get("/",(req,res)=>{
    res.json({message: "ok"})
})

app.listen(8000,()=>console.log("Listening on 8000"))