import restify, { RequestHandler } from 'restify'
const testFolder = '/Users/moritz/Musik';
import fs from 'fs';
import path from 'path';
import { Song } from './schema/song';

import { connect } from 'mongoose'
import restifyMongoose from 'restify-mongoose';
import * as mm from 'music-metadata';

async function main() {
  await connect('mongodb://localhost:27017/test');
  // collectSongsRec(testFolder);
}

main().catch(err => console.log(err));


const getArtists: RequestHandler = async (req, res, next) => {

  const artists = await Song.distinct('metaData.common.artist')
  res.send(200, {  artists })
  next();
}

const getAlbums: RequestHandler = async (req, res, next) => {
  const artist = req.query.artist ? JSON.parse(req.query.artist) : undefined
  const filter = artist ? { 'metaData.common.artist': { $in: artist } } : undefined;
  const albums = await Song.distinct('metaData.common.album',filter)  
  res.send(200, { albums })
  next();
}





const stream: RequestHandler = async (req, res, next) => {
  console.log(req)
  const song = await Song.findOne({_id: req.params['id']})
  if( !song ) {
    res.send(404)
    return
  }
  const p1 = song.filename

  if (fs.existsSync(p1)) {
    const stream = fs.createReadStream(p1)
    res.writeHead(200)
    stream.pipe(res)
  }
  else {
    res.send(404)
  }



}


// @ts-ignore
const songs = restifyMongoose(Song);
const getSongs: RequestHandler = async (req, res, next) => {
  const {artist=null, album=null} = req.query.filter ?JSON.parse(req.query.filter) : {}

  const filter: any = {}
  if( artist ) {
    filter['metaData.common.artist'] = {$in: artist }
  }
  if( album ) {
    filter['metaData.common.album'] = {$in: album }
  }
  const songs = await Song.find(filter, {_id: 1, path: 1, name: 1, 'metaData.common': 1} ).lean()
  res.send(200, { songs })
  next();
}


var server = restify.createServer();
server.use(restify.plugins.queryParser({mapParams:true}));

server.get('/stream/songs/:id', stream)


server.get('/api/artists', getArtists )
server.get('/api/albums', getAlbums )
server.get('/api/songs', getSongs)


server.listen(3333, function () {
  console.log('%s listening at %s', server.name, server.url);
});

function collectSongsRec(folder: string) {
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if (files) {
      files.forEach(async f => {
        const relPath = path.join(folder, f.name);
        if (f.isDirectory()) {
          collectSongsRec(relPath)
        } else if (f.isFile()) {
          try {
          const metaData = await mm.parseFile(relPath)
          console.log(metaData)
          const update = { filename: relPath, name: f.name, metaData };

          console.log(JSON.stringify(relPath))
          const query = await Song.findOneAndUpdate({ filename: relPath }, update, { upsert: true })
          console.log(query)
          } catch (e) {

            console.log(e)
          }
        }
      });
    }
  });
}
