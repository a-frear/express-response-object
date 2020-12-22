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
        let results = apps
        .filter(app =>
            app
                .App
                .toLowerCase()
                .includes(search.toLowerCase())
            && app
                .Genres
                .toLowerCase()
                .includes(genres.toLowerCase()))

        if (sort) {
            results
                .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            });
        }

    res
        .json(results);
    }

    //if no genres query
    let results = apps
        .filter(app =>
            app
                .App
                .toLowerCase()
                .includes(search.toLowerCase()))

    if (sort) {
        results
            .sort((a,b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0; 
            });
    }

    res
        .json(results);

});

app.listen(8000, () => {
    console.log('Server started on PORT 8000')
});