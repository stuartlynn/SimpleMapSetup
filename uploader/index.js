import express from 'express'
import Router from 'express-promise-router'
import fileUpload from 'express-fileupload'
import cors  from 'cors'
import stream from 'stream'
import uuidv4 from 'uuid/v4'
import { spawn, exec} from 'child_process'

const app = express()
const port = process.env.PORT || 3000
const router = new Router()

router.get('/',(req,res)=> res.send('I am a little uploader'))

router.post('/upload', async (req,res)=>{
  const file  = req.files.import;
  const uuid  = uuidv4()
  const tmpDest = `/app/data/${uuid}.geojson`
  const pgString = `dbname=carto user=carto host=postgis password=password`

  const tablename = req.body.tablename
  console.log('tablebane is ', tablename)
  console.log('dataset is ', tmpDest)


  file.mv(tmpDest, (err)=>{
    if(err){
      res.status(400).send('something went wrong moving the file')
    }
    else{
          //const command = ['ogr2ogr','-f','"PostgreSQL"',"PG:", `"${pgString}"`, `"${tmpDest}"`, '-nln',tablename]
          //console.log(command.join(' '))

      //const ogr = spawn('ogr2ogr',['-f','PostgreSQL"', `PG:"${pgString}"`, `${tmpDest}`, '-nln',tablename])
      const ogr = exec(`ogr2ogr -f PostgreSQL PG:"dbname=carto user=carto host=postgis password=password" ${tmpDest} -nln ${tablename}`)
      ogr.stdout.on('data',(data)=>{
        console.log(`stdout: ${data}`);
      })

      ogr.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      ogr.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if(code === 0){
          res.status('200').send('Upload successful')
        }
        else{
          res.status('400').send('Upload Failed')
        }
      })
    }
  })

})

app.use(cors())
app.use(fileUpload())
app.use('/',router)

app.listen( port, ()=> console.log(`uploader listening on port ${port}`))
