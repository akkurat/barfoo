"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const restify_1 = __importDefault(require("restify"));
const testFolder = '/Users/moritz/Musik';
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const song_1 = require("./schema/song");
const mongoose_1 = require("mongoose");
const restify_mongoose_1 = __importDefault(require("restify-mongoose"));
const mm = __importStar(require("music-metadata"));
async function main() {
    await (0, mongoose_1.connect)('mongodb://localhost:27017/test');
    // collectSongsRec(testFolder);
}
main().catch(err => console.log(err));
const getArtists = async (req, res, next) => {
    const artists = await song_1.Song.distinct('metaData.common.artist');
    res.send(200, { artists });
    next();
};
const getAlbums = async (req, res, next) => {
    const artist = req.query.artist ? JSON.parse(req.query.artist) : undefined;
    const filter = artist ? { 'metaData.common.artist': { $in: artist } } : undefined;
    const albums = await song_1.Song.distinct('metaData.common.album', filter);
    res.send(200, { albums });
    next();
};
const stream = async (req, res, next) => {
    console.log(req);
    const song = await song_1.Song.findOne({ _id: req.params['id'] });
    if (!song) {
        res.send(404);
        return;
    }
    const p1 = song.filename;
    if (fs_1.default.existsSync(p1)) {
        const stream = fs_1.default.createReadStream(p1);
        res.writeHead(200);
        stream.pipe(res);
    }
    else {
        res.send(404);
    }
};
// @ts-ignore
const songs = (0, restify_mongoose_1.default)(song_1.Song);
const getSongs = async (req, res, next) => {
    const { artist = null, album = null } = req.query.filter ? JSON.parse(req.query.filter) : {};
    const filter = {};
    if (artist) {
        filter['metaData.common.artist'] = { $in: artist };
    }
    if (album) {
        filter['metaData.common.album'] = { $in: album };
    }
    const songs = await song_1.Song.find(filter, { _id: 1, path: 1, name: 1, 'metaData.common': 1 }).lean();
    res.send(200, { songs });
    next();
};
var server = restify_1.default.createServer();
server.use(restify_1.default.plugins.queryParser({ mapParams: true }));
server.get('/stream/songs/:id', stream);
server.get('/api/artists', getArtists);
server.get('/api/albums', getAlbums);
server.get('/api/songs', getSongs);
server.listen(3333, function () {
    console.log('%s listening at %s', server.name, server.url);
});
function collectSongsRec(folder) {
    fs_1.default.readdir(folder, { withFileTypes: true }, (err, files) => {
        if (files) {
            files.forEach(async (f) => {
                const relPath = path_1.default.join(folder, f.name);
                if (f.isDirectory()) {
                    collectSongsRec(relPath);
                }
                else if (f.isFile()) {
                    try {
                        const metaData = await mm.parseFile(relPath);
                        console.log(metaData);
                        const update = { filename: relPath, name: f.name, metaData };
                        console.log(JSON.stringify(relPath));
                        const query = await song_1.Song.findOneAndUpdate({ filename: relPath }, update, { upsert: true });
                        console.log(query);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQWlEO0FBQ2pELE1BQU0sVUFBVSxHQUFHLHFCQUFxQixDQUFDO0FBQ3pDLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsd0NBQXFDO0FBRXJDLHVDQUFrQztBQUNsQyx3RUFBK0M7QUFDL0MsbURBQXFDO0FBRXJDLEtBQUssVUFBVSxJQUFJO0lBQ2pCLE1BQU0sSUFBQSxrQkFBTyxFQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDaEQsK0JBQStCO0FBQ2pDLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFHdEMsTUFBTSxVQUFVLEdBQW1CLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO0lBRTFELE1BQU0sT0FBTyxHQUFHLE1BQU0sV0FBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQzdELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUcsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUMzQixJQUFJLEVBQUUsQ0FBQztBQUNULENBQUMsQ0FBQTtBQUVELE1BQU0sU0FBUyxHQUFtQixLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUN6RCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUE7SUFDMUUsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFF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QUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO3dCQUNwQyxNQUFNLEtBQUssR0FBRyxNQUFNLFdBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTt3QkFDMUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtxQkFDakI7b0JBQUMsT0FBTyxDQUFDLEVBQUU7d0JBRVYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtxQkFDZjtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVzdGlmeSwgeyBSZXF1ZXN0SGFuZGxlciB9IGZyb20gJ3Jlc3RpZnknXG5jb25zdCB0ZXN0Rm9sZGVyID0gJy9Vc2Vycy9tb3JpdHovTXVzaWsnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU29uZyB9IGZyb20gJy4vc2NoZW1hL3NvbmcnO1xuXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAnbW9uZ29vc2UnXG5pbXBvcnQgcmVzdGlmeU1vbmdvb3NlIGZyb20gJ3Jlc3RpZnktbW9uZ29vc2UnO1xuaW1wb3J0ICogYXMgbW0gZnJvbSAnbXVzaWMtbWV0YWRhdGEnO1xuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICBhd2FpdCBjb25uZWN0KCdtb25nb2RiOi8vbG9jYWxob3N0OjI3MDE3L3Rlc3QnKTtcbiAgLy8gY29sbGVjdFNvbmdzUmVjKHRlc3RGb2xkZXIpO1xufVxuXG5tYWluKCkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xuXG5cbmNvbnN0IGdldEFydGlzdHM6IFJlcXVlc3RIYW5kbGVyID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG5cbiAgY29uc3QgYXJ0aXN0cyA9IGF3YWl0IFNvbmcuZGlzdGluY3QoJ21ldGFEYXRhLmNvbW1vbi5hcnRpc3QnKVxuICByZXMuc2VuZCgyMDAsIHsgIGFydGlzdHMgfSlcbiAgbmV4dCgpO1xufVxuXG5jb25zdCBnZXRBbGJ1bXM6IFJlcXVlc3RIYW5kbGVyID0gYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gIGNvbnN0IGFydGlzdCA9IHJlcS5xdWVyeS5hcnRpc3QgPyBKU09OLnBhcnNlKHJlcS5xdWVyeS5hcnRpc3QpIDogdW5kZWZpbmVkXG4gIGNvbnN0IGZpbHRlciA9IGFydGlzdCA/IHsgJ21ldGFEYXRhLmNvbW1vbi5hcnRpc3QnOiB7ICRpbjogYXJ0aXN0IH0gfSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgYWxidW1zID0gYXdhaXQgU29uZy5kaXN0aW5jdCgnbWV0YURhdGEuY29tbW9uLmFsYnVtJyxmaWx0ZXIpICBcbiAgcmVzLnNlbmQoMjAwLCB7IGFsYnVtcyB9KVxuICBuZXh0KCk7XG59XG5cblxuXG5cblxuY29uc3Qgc3RyZWFtOiBSZXF1ZXN0SGFuZGxlciA9IGFzeW5jIChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICBjb25zb2xlLmxvZyhyZXEpXG4gIGNvbnN0IHNvbmcgPSBhd2FpdCBTb25nLmZpbmRPbmUoe19pZDogcmVxLnBhcmFtc1snaWQnXX0pXG4gIGlmKCAhc29uZyApIHtcbiAgICByZXMuc2VuZCg0MDQpXG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgcDEgPSBzb25nLmZpbGVuYW1lXG5cbiAgaWYgKGZzLmV4aXN0c1N5bmMocDEpKSB7XG4gICAgY29uc3Qgc3RyZWFtID0gZnMuY3JlYXRlUmVhZFN0cmVhbShwMSlcbiAgICByZXMud3JpdGVIZWFkKDIwMClcbiAgICBzdHJlYW0ucGlwZShyZXMpXG4gIH1cbiAgZWxzZSB7XG4gICAgcmVzLnNlbmQoNDA0KVxuICB9XG5cblxuXG59XG5cblxuLy8gQHRzLWlnbm9yZVxuY29uc3Qgc29uZ3MgPSByZXN0aWZ5TW9uZ29vc2UoU29uZyk7XG5jb25zdCBnZXRTb25nczogUmVxdWVzdEhhbmRsZXIgPSBhc3luYyAocmVxLCByZXMsIG5leHQpID0+IHtcbiAgY29uc3Qge2FydGlzdD1udWxsLCBhbGJ1bT1udWxsfSA9IHJlcS5xdWVyeS5maWx0ZXIgP0pTT04ucGFyc2UocmVxLnF1ZXJ5LmZpbHRlcikgOiB7fVxuXG4gIGNvbnN0IGZpbHRlcjogYW55ID0ge31cbiAgaWYoIGFydGlzdCApIHtcbiAgICBmaWx0ZXJbJ21ldGFEYXRhLmNvbW1vbi5hcnRpc3QnXSA9IHskaW46IGFydGlzdCB9XG4gIH1cbiAgaWYoIGFsYnVtICkge1xuICAgIGZpbHRlclsnbWV0YURhdGEuY29tbW9uLmFsYnVtJ10gPSB7JGluOiBhbGJ1bSB9XG4gIH1cbiAgY29uc3Qgc29uZ3MgPSBhd2FpdCBTb25nLmZpbmQoZmlsdGVyLCB7X2lkOiAxLCBwYXRoOiAxLCBuYW1lOiAxLCAnbWV0YURhdGEuY29tbW9uJzogMX0gKS5sZWFuKClcbiAgcmVzLnNlbmQoMjAwLCB7IHNvbmdzIH0pXG4gIG5leHQoKTtcbn1cblxuXG52YXIgc2VydmVyID0gcmVzdGlmeS5jcmVhdGVTZXJ2ZXIoKTtcbnNlcnZlci51c2UocmVzdGlmeS5wbHVnaW5zLnF1ZXJ5UGFyc2VyKHttYXBQYXJhbXM6dHJ1ZX0pKTtcblxuc2VydmVyLmdldCgnL3N0cmVhbS9zb25ncy86aWQnLCBzdHJlYW0pXG5cblxuc2VydmVyLmdldCgnL2FwaS9hcnRpc3RzJywgZ2V0QXJ0aXN0cyApXG5zZXJ2ZXIuZ2V0KCcvYXBpL2FsYnVtcycsIGdldEFsYnVtcyApXG5zZXJ2ZXIuZ2V0KCcvYXBpL3NvbmdzJywgZ2V0U29uZ3MpXG5cblxuc2VydmVyLmxpc3RlbigzMzMzLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnNvbGUubG9nKCclcyBsaXN0ZW5pbmcgYXQgJXMnLCBzZXJ2ZXIubmFtZSwgc2VydmVyLnVybCk7XG59KTtcblxuZnVuY3Rpb24gY29sbGVjdFNvbmdzUmVjKGZvbGRlcjogc3RyaW5nKSB7XG4gIGZzLnJlYWRkaXIoZm9sZGVyLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSwgKGVyciwgZmlsZXMpID0+IHtcbiAgICBpZiAoZmlsZXMpIHtcbiAgICAgIGZpbGVzLmZvckVhY2goYXN5bmMgZiA9PiB7XG4gICAgICAgIGNvbnN0IHJlbFBhdGggPSBwYXRoLmpvaW4oZm9sZGVyLCBmLm5hbWUpO1xuICAgICAgICBpZiAoZi5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgY29sbGVjdFNvbmdzUmVjKHJlbFBhdGgpXG4gICAgICAgIH0gZWxzZSBpZiAoZi5pc0ZpbGUoKSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgbWV0YURhdGEgPSBhd2FpdCBtbS5wYXJzZUZpbGUocmVsUGF0aClcbiAgICAgICAgICBjb25zb2xlLmxvZyhtZXRhRGF0YSlcbiAgICAgICAgICBjb25zdCB1cGRhdGUgPSB7IGZpbGVuYW1lOiByZWxQYXRoLCBuYW1lOiBmLm5hbWUsIG1ldGFEYXRhIH07XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZWxQYXRoKSlcbiAgICAgICAgICBjb25zdCBxdWVyeSA9IGF3YWl0IFNvbmcuZmluZE9uZUFuZFVwZGF0ZSh7IGZpbGVuYW1lOiByZWxQYXRoIH0sIHVwZGF0ZSwgeyB1cHNlcnQ6IHRydWUgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZyhxdWVyeSlcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIl19