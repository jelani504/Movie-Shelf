const express = require('express');
const axios = require('axios');
const { MOVIE_DB_API } = require('../config');

const { ENDPOINT, KEY } = MOVIE_DB_API;
const search = express.Router();

search.get('/', (req, res) => {
  const { query } = req.query;

  axios.get(`${ENDPOINT}/search/movie?api_key=${KEY}&query=${query}`)
    .then(response => res.status(200).send(response.data.results.slice(0, 15)))
    .catch(error => res.status(500).send({ error: error.message }));
});

search.get('/video', (req, res) => {
  const { id } = req.query;

  axios.get(`${ENDPOINT}/movie/${id}/videos?api_key=${KEY}`)
    .then(response => res.status(200).send(response.data))
    .catch(error => res.status(500).send({ error: error.message }));
});

search.get('/cast', (req, res) => {
  const { id } = req.query;

  axios.get(`${ENDPOINT}/movie/${id}/credits?api_key=${KEY}`)
    .then((response) => {
      const { cast, crew } = response.data;
      res.status(200).send({ cast, crew });
    })
    .catch(error => res.status(500).send({ error: error.message }));
});

search.get('/nowPlaying', (req, res) => {
  axios.get(`${ENDPOINT}/movie/now_playing?api_key=${KEY}&language=en-US&page=1`)
    .then((response) => {
      const { data } = response;
      res.status(200).send(data.results.slice(0, 15));
    })
    .catch(error => res.status(500).send({ error: error.message }));
});

search.get('/upcoming', (req, res) => {
  axios.get(`${ENDPOINT}/movie/upcoming?api_key=${KEY}&language=en-US&page=1`)
    .then((response) => {
      const { data } = response;
      const dateToday = new Date();
      const upcomingMovies = data.results.filter(movie => new Date(movie.release_date) > dateToday);
      res.status(200).send(upcomingMovies);
    })
    .catch(error => res.status(500).send({ error: error.message }));
});

search.get('/movies', (req, res) => {
  const { id } = req.query;
  axios.get(`${ENDPOINT}/movie/${id}?api_key=${KEY}`)
    .then(response => res.status(200).send(response.data))
    .catch(error => res.status(500).send({ error: error.message }));
});

module.exports = search;
