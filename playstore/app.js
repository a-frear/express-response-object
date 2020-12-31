const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('common'));
app.use(cors());

const apps = require('./playstore');

app.get('/apps', (req, res) => {
    const { search=" ", sort, genres } = req.query;

    if (sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be by Rating or App')
        }
    }

    if (genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res
                .status(400)
                .send('Genre must be: Action, Puzzle, Strategy, Casual, Arcade, or Card')
        }
    }

    if (genres) {
        appsResults = apps.filter(app =>
            app
                .Genres
                .toLowerCase()
                .includes(genres.toLowerCase()));
    };

    //if no genres query
    appsResults = apps.filter(app =>
            app
                .App
                .toLowerCase()
                .includes(search.toLowerCase()))

    if (sort) {
        appsResults
            .sort((a,b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0; 
            });
    }

    res
        .json(appsResults);

});

module.exports = app;