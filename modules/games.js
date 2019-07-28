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
 * Get Game configuration of moves
 */
app.get(routePrefix + "/moves", (req, res) => {
    return res.status(200).send(config.CONSTANTS.moves);
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
 * Get game data
 * */
app.get(routePrefix + "/:game_id", (req, res) => {
    Game.findById(req.params.game_id, (err, game) => {
        return res.status(200).json(game);
    });   
});

/**
 * Get all game results
 * */
app.get(routePrefix + "/results/:game_id", (req, res) =>{
    Game.findById(req.params.game_id, (err, game) => {
        if(game.results.length > 0){
            return res.status(200).json(game.results);
        }
        
        return res.status(200).json({message: "No rounds played yet."});
    });        
});

/**
 * add round moves
 * */
app.post(routePrefix + "/round/:game_id", (req, res) => {
    Game.findById(req.params.game_id, (err, game) => {
        if (err) {
            res.send(err);
        }

        let roundWinner = 'tie';

        // Evaluate winner
        config.CONSTANTS.moves.forEach((move) => {
            if(req.body.moveone == move.type){
                if(req.body.movetwo == move.kills){
                    roundWinner = game.playerone;
                    game.wonByOne++;
                }
            }

            if(req.body.movetwo == move.type){
                if(req.body.moveone == move.kills){
                    roundWinner = game.playertwo;
                    game.wonByTwo++;
                }
            }
        });

        let round = game.results.length + 1;
        game.results.push({round: round, winner: roundWinner, playedAt: new Date()});
        
        let response;
        if(game.wonByOne === 3){
            game.winner = game.playerone;
            response = {winner:"Jugador uno", name: game.playerone};
        }else if(game.wonByTwo === 3){
            game.winner = game.playertwo;
            response = {winner:"Jugador dos", name: game.playertwo};
        }else{
           response = {winner:"no", name: null};
        }

        // Save the game and verify if winner
        game.save((err, game) => {
            if (err) {
                res.send(err);
            }

            res.status(200).json(response);
        });
    });
});
