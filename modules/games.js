'use strict';
var _ = require('lodash');
var express = require('express');
var Game = require('../models/game');
var app = module.exports = express.Router();
var config = require('../config');

var routePrefix = '/game';

/**
 * Get Games
 * */
app.get(routePrefix, (req, res) => {
    var query = {};

    // Sort options
    var sort = '';
    if (req.query.sort) {
        sort = req.query.sort;
    }

    // Pagination options
    var options = {
        sort: sort,
        populate: 'role',
        lean: true,
        offset: req.query.offset ? Number.parseInt(req.query.offset) : 0,
        limit: req.query.limit ? Number.parseInt(req.query.limit) : 5
    };

    Game.paginate(query, options).then(games => {
        res.status(200).json(games);
    });
});

/**
 * Create and start a new game
 * */
app.post(routePrefix, (req, res) => {
    if (!req.body.playerone || !req.body.playertwo){
        return res.status(400).send('Completa todos los campos');
    }

    var game = new Game();
    game.playerone  = req.body.playerone;
    game.playertwo  = req.body.playertwo;
    game.winner     = null;
    game.results    = new Array();
    game.createdAt  = new Date();

    game.save((err, game) => {
        if (err) 
            return console.error(err);

        res.status(201).json(game);
    });

});

/**
 * Get all game results
 * */
app.get(routePrefix + "/results", (req, res) =>{
    Game.findById(req.params.game_id, (err, game) => {
        return res.status(200).json(game.results);
    });
});

/**
 * add round moves
 * */
app.post(routePrefix + "/round/:game_id", (req, res) => {
    Game.findById(req.params.game_id, (err, game) => {
        console.log(game);
        if (err) {
            res.send(err);
        }

        let roundWinner = 'tie';

        // Evaluate winner
        config.CONSTANTS.moves.forEach((move) => {
            if(req.body.moveone == move.type){
                if(req.body.movetwo == move.kills){
                    roundWinner = game.playerone;
                    console.log("jugador uno: "+req.body.moveone + " mato a " + req.body.movetwo);
                }
            }

            if(req.body.movetwo == move.type){
                if(req.body.moveone == move.kills){
                    roundWinner = game.playertwo;
                    console.log("jugador dos: "+req.body.movetwo + " mato a " + req.body.moveone);
                }
            }
        });

        let round = game.results.length + 1;
        game.results.push({round: round, winner: roundWinner, playedAt: new Date()});
        
        // calculate round won by each user
        let valor = [];
        game.results.forEach(result => {
            valor[result.winner] = valor[result.winner] ? valor[result.winner] + 1 : 1;
        });
        console.log(valor);
        
        // Save the game
        game.save((err, game) => {
            if (err) {
                res.send(err);
            }

            res.status(200).json(game);
        });
    });
});
