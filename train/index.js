import { trainAStationDistance, trainBStationDistance, trainAHydDist, trainBHydDist } from './station_distance.js';
import fs from 'fs';

var filename = process.argv[2];

function cleanString(str) {
    return str.replace(/(\r\n|\n|\r)/gm, "")
}

function readFromFile() {
    try {
        const data = fs.readFileSync(filename, 'utf8')
        const input = data.split('\n');
        return [input[0].split(' ').splice(2), input[1].split(' ').splice(2)];
    } catch (err) {
        console.error(err)
    }
}

const [trainA, trainB] = readFromFile();

let stationAfterHyd = {}

const stationDistFrmHyd = () => {
    let ans = {};
    for (const [key, value] of Object.entries(trainAStationDistance)) {
        if (value - 1200 > 0) {
            ans[key] = value - 1200;
        }
    }

    for (const [key, value] of Object.entries(trainBStationDistance)) {
        if (value - 2000 > 0) {
            ans[key] = value - 2000;
        }
    }

    const sortedDistance = Object.fromEntries(
        Object.entries(ans).sort(([,a],[,b]) => b-a)
    );
    
    return sortedDistance;
}

const findOrderOfStation = (train, id, stationDistance, dist) => {

    let orderOfBogies = []

    train.map((station) => {
        station = cleanString(station)
        if (stationDistance[station] == undefined || stationDistance[station] >= dist) {
            orderOfBogies.push([station, stationDistance[station]]);
        }
    })

    let ans = "";

    if (id === 'A') {
        ans += "ARRIVAL TRAIN_A ENGINE "
    }
    else if (id === 'B') {
        ans += "ARRIVAL TRAIN_B ENGINE "
    }


    for (let x of orderOfBogies) {
        if(x[0] !== 'HYB'){
            stationAfterHyd[x[0]] = stationAfterHyd[x[0]] === undefined ? 1 : stationAfterHyd[x[0]]+1;
        }
        ans += x[0] + " "
    }

    return ans.trim();
}


console.log(findOrderOfStation(trainA, 'A', trainAStationDistance, trainAHydDist));
console.log(findOrderOfStation(trainB, 'B', trainBStationDistance, trainBHydDist));

const distanceFromHyd = stationDistFrmHyd();

const findOrderOfBogies = () => {

    let ans = "DEPARTURE TRAIN_AB ENGINE ENGINE ";

    for (const [key, value] of Object.entries(distanceFromHyd)) {
        if(stationAfterHyd.hasOwnProperty(key)){
            ans += (key+ " ").repeat(stationAfterHyd[key])
        }
    }

    return ans.trim();
}

console.log(findOrderOfBogies());

