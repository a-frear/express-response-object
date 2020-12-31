const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                let exampleApp = res.body[0];
                expect(exampleApp).to.include.all.keys(
                    'Android Ver', 'App', 'Category', 'Content Rating',
                    'Current Ver', 'Genres', 'Installs', 'Last Updated',
                    'Price', 'Rating', 'Reviews', 'Size', 'Type'
                );
            });
    });

    it('should be 400 if invalid sort', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Sort must be by Rating or App');
    });

    it('Should be 400 if invalid genres', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'MISTAKE' })
            .expect(400, 'Genre must be: Action, Puzzle, Strategy, Casual, Arcade, or Card')
    });

    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;

                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i+1];

                    if(appAtIPlus1.Rating < appAtI.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
        })
    });


})
