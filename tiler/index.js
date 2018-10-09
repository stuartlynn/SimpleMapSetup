import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import Router from 'express-promise-router'
import db from './db'
import SphericalMercator from 'sphericalmercator'
import cors  from 'cors'

const mercator = new SphericalMercator({size:256})

const app = express()
const port = process.env.PORT || 8886
const router = new Router()

router.get('/',(req,res)=>res.send("I am a little tiler"))

router.get('/query/', async (req,res)=>{
  const query = req.query['q']
  const result = await db(query)
  res.send(result)
})

router.get('/tiles/:z/:x/:y.mvt', async (req,res)=>{
   const startTime  = Date.now()
   const {z,x,y} = req.params;
   const bbox = mercator.bbox(x,y,z,false)
   const layer_name = req.query['layer'] ? req.query['layer'] : 'layer'
   const query = req.query['q']

   if(! query){
      res.status(400).send('A query is required to get tiles')
   }

   const sample_response = await db(` select * from (${query}) q  limit 1 `)
   const columns = sample_response.fields.map((r)=>r.name).filter((n)=> n != 'geom')

   const SQL = `
    SELECT ST_AsMVT(q, '${layer_name}', 4096, 'geom')
    FROM (
      SELECT
          ${columns.join(',')},
          ST_AsMVTGeom(
              geom,
              ST_MakeEnvelope(${bbox[0]}, ${bbox[1]}, ${bbox[2]}, ${bbox[3]}, 4326),
              4096,
              256,
              false
          ) geom
      FROM (
        ${query}
      ) c
    ) q
   `

  try{
    const result = await db(SQL)
    res.setHeader("Content-Type", "application/x-protobuf")
    const tileData = result['rows']['0']['st_asmvt']

    if(tileData.length===0){
      res.status(204)
    }
    console.log( (Date.now() - startTime)/1000.0)
    res.send(tileData)
  }
  catch (e){
    res.status(404).send({
      error: e.toString()
    })
  }

})
app.use(cors())
app.use('/',router)

app.listen(port,()=>console.log(`tiler listening on port ${port}!`))
