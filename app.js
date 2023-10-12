
// const express = require('express')
import express from "express"
import dotenv from "dotenv"
dotenv.config()
// require('dotenv').config()

const app = express()
const appPort = process.env.APP_PORT


// const moment = require('moment-timezone')
import moment from 'moment-timezone'
import { todayTrends, realTimeTrends, relatedQueries } from "./api.js"



const thisHourToday = () => {
  return moment().tz('Asia/Jakarta').format('YYYY-MM-D-HH')
}



app.get('/today-trends', todayTrends)
app.get('/realtime-trends', realTimeTrends)
app.get('/related-keyword', relatedQueries)


app.listen(appPort, () => {
  console.log(`Listen on : ${appPort}`)
})