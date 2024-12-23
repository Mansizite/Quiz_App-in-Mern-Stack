const express = require('express')
const dotenv = require('dotenv')
const connect = require('./database/db')
const questionRouter = require('./router/questionRouter')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/question',questionRouter)
connect()
dotenv.config()


app.listen(process.env.port,()=>{
    console.log(`server is running on port ${process.env.port}`)

})