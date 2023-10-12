

import moment from 'moment-timezone'
import cache from './utils/cache.js'
import googleTrends from "google-trends-api"
// const googleTrends = require('google-trends-api')
import { slugify } from './utils/string.js'

import { HttpsProxyAgent } from "https-proxy-agent"

const mycache = cache.cache

export const todayTrends = (req, res) => {

  let proxyAgent = new HttpsProxyAgent('https://dawn-resonance-c55c.apiseries.workers.dev/?');

  const geo = req.query.geo ?? 'ID'
  const trendDate = req.query.date ?? moment().tz('Asia/Jakarta').format('YYYY-MM-D-HH')

  const cacheKey = `today-trends-` + geo + '-' + trendDate
  mycache.get(cacheKey).then(result => {
    if (result == undefined) {
      let serverData
      googleTrends.dailyTrends({ trendDate, geo, }).then(result => {
        console.log('Cache expired or not exist, fetch new data')
        serverData = JSON.parse(result)
        mycache.set(cacheKey, serverData)
        res.send(serverData);
      })

    } else {
      res.send(result)
    }
  })
}
export const realTimeTrends = (req, res) => {
  const geo = req.query.geo ?? 'US',
    hl = req.query.hl ?? 'english',
    category = req.query.category ?? 'all',
    cacheKey = `realtime-trends-` + geo + '-' + category

  cache.get(cacheKey).then(result => {
    if (result == undefined) {

      googleTrends.realTimeTrends({
        geo, category
      }).then(result => {
        console.log('Cache expired or not exist, fetch new data')
        serverData = JSON.parse(result)
        cache.set(cacheKey, serverData)
        res.send(serverData);
      }).catch(err => {
        res.send({
          success: false,
          msg: 'Please change Geo Code'
        })
      })
    } else {
      res.send(result)
    }
  })
}


export const relatedQueries = (req, res) => {
  const keyword = req.query.keyword ?? 'Resep Masakan Padang'
  const cacheKey = `related-queries-` + slugify(keyword)
  mycache.get(cacheKey).then(result => {
    if (result == undefined) {

      googleTrends.relatedQueries({
        keyword
      }).then(result => {
        console.log('Cache expired or not exist, fetch new data')
        serverData = JSON.parse(result)
        mycache.set(cacheKey, serverData)
        res.send(serverData);
      }).catch(err => {
        res.send({
          success: false,
          msg: 'Please change keyword Code'
        })
      })
    } else {
      res.send(result)
    }
  })

}

