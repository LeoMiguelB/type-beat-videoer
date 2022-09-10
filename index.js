const express = require('express');

const upload = require('express-fileupload');

let bodyParser = require('body-parser');

const app = express();

const {getAudioDurationInSeconds} = require('get-audio-duration')

const fs = require('fs');

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

let fileN;

app.use(upload());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.use(function (req, res, next) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.get('/getDuration', async (req, res) => {
    // From a local path...
    await getAudioDurationInSeconds(`./uploads/${fileN}`).then((duration) => {
        res.json({ dur: duration });

        fs.unlinkSync(`./uploads/${fileN}`);

        fileN = '';
    })
})


app.post('/', (req,res) => {
    if(req.files) {

        let file = req.files.material[1];

        let filename = fileN = file.name;

        file.mv('./uploads/' + filename, function (err) {
            if(err) {
                res.send(err);
            }
        })

    }
})


let port = 5500;

app.listen(port, () => {
    console.log('app is listening on port' + port);
})
