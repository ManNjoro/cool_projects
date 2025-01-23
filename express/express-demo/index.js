// import Joi from "joi";
const startUpDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const config = require('config')
const morgan = require("morgan")
const helmet = require('helmet')
const Joi = require("joi");
const express = require("express");
// import express, { json, urlencoded, static } from "express";
// import log from "./logger.js"
const logger = require("./middleware/logger.js");
const courses =  require('./routes/courses.js')
const home = require('./routes/home.js')
const app = express();

app.set('view engine', 'pug')

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log(`app: ${app.get('env')}`)

app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet())
app.use('/api/courses', courses)
app.use('/', home)

// CONFIG
console.log(`Application Name: ${config.get('name')}`)
console.log(`Mail Server: ${config.get('mail.host')}`)
console.log(`Mail Password: ${config.get('mail.password')}`)

if(app.get('env') === 'development') {
  app.use(morgan('tiny'))
  startUpDebugger('Morgan enabled...')
}

// Db work
dbDebugger('Connected to the database...')

app.use((req, res, next) => {
  console.log("Authenticating...");
  next();
});



app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.query);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
