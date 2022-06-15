var express = require('express');
var app = express();

const cors = require('cors');
const fs = require('fs');

const { Pool } = require("pg")
const SphericalMercator = require("@mapbox/sphericalmercator")

var expressStaticGzip = require("express-static-gzip");

var path = require('path');

app.use(cors({credentials: true, origin: 'http://localhost:9000'}));


/*
const pool = new Pool({
  host: "pg-docker",
  port: 5432,
  user: "docker",
  database: "vector-tiles",
  password: 'docker'
})
*/


const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "vector-tiles",
  password: '123456'
})


const mercator = new SphericalMercator()

app.get("/mvt/:cod/:clase/:x/:y/:z.pbf", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
  console.log(bbox.join(", "))


  const clase = req.params.clase;
  var complemento = "";
  if (clase !== '0') {
    complemento=`and clase=${clase}`
  }
  

  var sql = `
  SELECT ST_AsMVT(q, 'buildings', 4096, 'geom')
  FROM (
      SELECT
      pk,municipio,indice,unidad_cobertura,area_operativa,total_viviendas_esperadas,total_viviendas_censadas,uso_vivienda,uso_mixto,uso_no_residencial,uso_lea,
          ST_AsMVTGeom(
              geom,
              TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 3857),
              4096,
              0,
              false
          ) geom
      FROM mact_def
      WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 3857)))
      and municipio='${req.params.cod}' ${complemento}
  ) q`
  

  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
  pool.query(sql, values , function(err, mvt) {
          if (err) {
              console.log(err)
              response.status(400)
          } else {
            //console.log(mvt.rows[0].st_asmvt)
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/x-protobuf')
              fs.writeFileSync("foo.pbf", mvt.rows[0].st_asmvt);
              res.send(mvt.rows[0].st_asmvt)
          }
  })
})

app.get("/select/:nombre/:x/:y/:z.pbf", function(req, res) {
  let bbox = mercator.bbox(req.params.x, req.params.y, req.params.z)
  console.log(bbox.join(", "))


  var sql = `
  SELECT ST_AsMVT(q, 'buildings', 4096, 'geom')
  FROM (
      SELECT
      
          ST_AsMVTGeom(
              geom,
              TileBBox(${req.params.z}, ${req.params.x}, ${req.params.y}, 3857),
              4096,
              0,
              false
          ) geom
      FROM mpio_p
      WHERE ST_Intersects(geom, (SELECT ST_Transform(ST_MakeEnvelope($1, $2, $3, $4, $5), 3857)))
      and nombre_mpio='${req.params.nombre}'
  ) q`
  

  const values = [bbox[0], bbox[1], bbox[2], bbox[3], 4326]
  pool.query(sql, values , function(err, mvt) {
          if (err) {
              console.log(err)
              response.status(400)
          } else {
            //console.log(mvt.rows[0].st_asmvt)
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Content-Type', 'application/x-protobuf')
              fs.writeFileSync("foo.pbf", mvt.rows[0].st_asmvt);
              res.send(mvt.rows[0].st_asmvt)
          }
  })
})

app.get('/box/:mun/:clase', function (req, res) {


  const clase = req.params.clase;
  var complemento = "";
  if (clase !== '0') {
    complemento=`and clase=${clase}`
  }

  const sql = `
  select st_xmin(ST_Extent(geom)),st_ymin(ST_Extent(geom)), 
  st_xmax(ST_Extent(geom)),st_ymax(ST_Extent(geom)) 
  from mact_def where municipio='${req.params.mun}'  ${complemento}`
  

  pool.query(sql, function(err, results) {
    if (err) {
      console.log(err)
      res.status(200).json("error")
      throw error
    } else {
      res.status(200).json(results.rows)
    }
})




})



app.get('/info/:mun', function (req, res) {

  const sql =`select 
  count(total_viviendas_transmitidas)as "Total de viviendas transmitidas",
  sum(total_viviendas_esperadas) as "Total de viviendas esperadas",
  sum(total_viviendas_censadas) as "Total de viviendas censadas",
  sum(uso_vivienda) as "Total uso vivienda",
  sum(uso_mixto) as "Total uso mixto",
  sum(uso_no_residencial) as "Total uso no residencial",
  sum(uso_lea) as "Total uso lea" from mact_def where municipio='${req.params.mun}'`

  pool.query(sql, function(err, results) {
    if (err) {
      console.log(err)
      res.status(200).json("error")
      throw error
    } else {
      res.status(200).json(results.rows)
    }
})

})



//get file from backend csv
app.get('/datos/:archivo', function (req, res) {
  
  var archivo = req.params.archivo;
  
    const file = `${__dirname}/datos/`+archivo+`.zip`;

    res.writeHead(200, {
        'Content-Type': 'application/zip'
    });

    var readStream = fs.createReadStream(file);
    readStream.pipe(res);


});


var DIST_DIR = path.join(__dirname, "../dist/");

app.use("/",expressStaticGzip(DIST_DIR));


//serve vector tiles
app.get('/:layer/:x/:y/:z.pbf', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');

  const z = req.params.z;
  const x = req.params.x;
  const y = req.params.y;
  const layer = req.params.layer;
  
  var file = __dirname + '/'+layer+'/' + z + '/' + x + '/' + y + '.gz';
  
  
  if (fs.existsSync(file)) {
      var fileDos = fs.readFileSync(file);

      res.writeHead(200, {'Content-Type': 'application/x-protobuf', 'Content-Encoding': 'gzip'});

      res.end(fileDos);

  } else {
      res.sendStatus(400)
  }

});

//deploy in port 3000
app.listen(3000, function () {
  console.log('listening on port 3000!');
});