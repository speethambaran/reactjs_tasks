const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const userRouter = require('./routes/userRouter')
const app = express()

const port = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
dotenv.config()

// Route configuration
app.use('/api/v1/user',userRouter)


app.get('/',(req,res)=>[
    res.send('Nodejs is working....')
])

app.listen(port,()=>{
    console.log(`Server is running at the port ${port}`)
})