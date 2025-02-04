const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const CronJob = require('cron').CronJob;
const LocomotiveRoute = require('./route/LocomotiveRoute');
const ImageController = require('./controller/ImageController');
const LocomotiveSchema = require('./model/LocomotiveDTO')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '100mb' }));

mongoose.connect('mongodb://localhost:27017/RailwayProject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    app.listen(4001, () => {
        console.log('Loco Service has been started on port  4001');
    });
}).catch(error => {
    console.log(error);
});

// const job = new CronJob('* * * * * *', async function() {
//     var today = new Date();
//     const _getAllSchedule = await LocomotiveSchema.find({ locoStatus: 2 });
//     if (_getAllSchedule && _getAllSchedule > 0) {
//         if (new Date(param.enMileDate) < today) {
//             await LocomotiveSchema.updateOne
//         }
//     }

// }, null, true, 'America/Los_Angeles');
// job.start();

app.use('/api/v1/locoRoute', LocomotiveRoute);

app.use('/api/v1/imageController', ImageController);