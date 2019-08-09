const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const Event = require('events');
let ffmpeg = require('ffmpeg');
let event = new Event();
module.exports = (app) => {
    
    
    /**UUID function togenerate unique Id for for file name */
    let create_UUID = () => {
        let time = new Date().getTime();
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          let r = (time + Math.random() * 16) % 6 | 0;
          time = Math.floor(time / 16);
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
      }

      /**
       * uploading video to the server.
       */
      app.post('/uploadVideo', function(req, res) {
        let filename=[];
        let file = req.files.file;
        extend = path.extname(req.files.file.name.toString());
        if(req.session.fileName){
          filename.push(req.session.fileName);
        }else{
          filename.push(`${create_UUID()}${extend}`);
        }
        let filePath =`${__dirname}/public/${filename[0]}`;
        file.mv(filePath, err => {
            if (err) {
              console.log(err);
              event.emit("sendErrorResponse", err);
              throw err;
            }
          });
          req.session.fileName=filename[0];
          res.send({fileName:filename[0]});
        });
      
      /**
       * Streaming video to the front end
       */
      app.get('/Video', function(req, res) {
        if(!req.session.fileName){
          res.end();
          return;
        }
        const path = `${__dirname}/public/${req.session.fileName}`
        const stat = fs.statSync(path)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {//Initial request.
          const parts = range.replace(/bytes=/, "").split("-")
          let start = parseInt(parts[0], 10)
          const end = parts[1] 
            ? parseInt(parts[1], 10)
            : fileSize-1
          //start=start>end?0:start;
          const chunksize = (end-start)+1
          const file = fs.createReadStream(path, {start, end})
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
          }
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          }
          res.writeHead(200, head)
          fs.createReadStream(path).pipe(res).on('close', function (err) {
            console.log("123456789")
        });
        }
      });

    /**
     * Crop the vedio based on start and end specified by the user
     */
    app.route("/cutVideo").post((req,res)=>{
      try {
        let path=`${__dirname}/public/${req.session.fileName}`;
        let cpath=`${__dirname}/public/c${req.session.fileName}`;
        req.session.fileName=`c${req.session.fileName}`;
        let process = new ffmpeg(path);
        process.then(function (video) {
        let duration=(video.metadata.duration.seconds*req.body.endTime/100)-(video.metadata.duration.seconds*req.body.startTime/100)
        video.setVideoStartTime(parseInt(video.metadata.duration.seconds*req.body.startTime/100, 10))
        video.setVideoDuration(parseInt(duration, 10))
        video.save(cpath,()=>{
          fs.unlink(path,()=>{});
          fs.createReadStream(cpath).pipe(res)
        });
        }, function (err) {
          console.log('Error: ' + err);
        });
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }
    });
       
    // Handle React routing, return all requests to React app
    app.get('/', function (req, res) {
         res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
    }      