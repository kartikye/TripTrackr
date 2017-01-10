var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");
var moment = require("moment");
var request = require("request");
var mysql = require("mysql");

var connection = mysql.createPool({
    connectionLimit : 10,
    host     : '182.50.133.171',
    user     : 'travellogger',
    password : 'Myturtle1!',
    database : 'travellogger'
})

var tokenSecret = "lalallolfnrfeoeugnrgtjgnrtogrhjoejhthijenheniteornhort"
var googleSecret = "ppJmnULTFEMmbOjSoQNJYBq9"

function createToken(id) {
    var payload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: id
    }

    return jwt.encode(payload, tokenSecret)
}

function ensureAuthenticated(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).send(
            { 
                message: 'Please make sure your request has an Authorization header'
            }
        )
    }
    
    var token = req.header('Authorization').split(' ')[1]

    var payload = null
  
    try {
        payload = jwt.decode(token, tokenSecret)
    } catch (err) {
        return res.status(401).send(
            {
                message: err.message
            }
        )
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send(
            {
                message: 'Token has expired'
            }
        )
    }
  
    req.user = payload.sub
    next()
}

router.post('/auth/google', function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token'
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: googleSecret,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    }
    
    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
        var accessToken = token.access_token
        var headers = { Authorization: 'Bearer ' + accessToken }
        
        // Step 2. Retrieve profile information about the current user.
        request.get({ 
            url: peopleApiUrl, 
            headers: headers, 
            json: true
        }, function(err, response, profile) {
            if (!err){
                if (profile.error) {
                    return res.status(500).send({message: profile.error.message});
                }
                // Step 3a. Link user accounts.
                if (req.header('Authorization')) {
                    res.send(profile)
                } else {
                    console.log("querying database");
                    connection.query("select user_id from users where google = " + "'"+profile.sub+"'", function(err, results) {
                        if (err){
                        } else if (results.length > 0) {
                            console.log(results)
                            return res.send({
                                token: createToken(results[0].user_id)
                            })
                        } else {
                            var name = profile.name
                            var email = profile.email
                            var google = profile.sub
                            
                            connection.query("insert into users (name, email, google) values ('"+name+"','"+email+"','"+google+"')", function (err, results) {
                                if (err){
                                    console.log(err);
                                } else {
                                    console.log(results);
                                }
                                
                                /*connection.destroy()*/
                            })
                        }
                    })
                }
            }
        })
    })
})

router.get('/api/name', function (req, res) {
        var user_id = req.query.user_id

    connection.query("select name from users where user_id = " + user_id, function(err, results) {
        if (err){
            console.log(err)
            return res.send("Error")
        } else if (results.length > 0) {
            console.log(results[0].name)
            return res.send(results[0].name)
        }
        
        /*connection.destroy()*/
    })
})

router.get('/api/share', function (req, res) {
    var user_id = req.query.user_id
    
    console.log(user_id)

    connection.query("select share from users where user_id = " + user_id, function(err, results) {
        if (err){
            console.log(err)
            return res.send("Error")
        } else if (results.length > 0) {
            console.log(results[0])
            return res.send({share: results[0].share})
        }
        
        /*connection.destroy()*/
    })
})

router.get('/api/trips/delete', function(req, res) {
    var trip_id = req.query.trip_id
    console.log(trip_id)
    connection.query("DELETE FROM trips WHERE trips.trip_id = '"+trip_id+"'", function(err, results) {
        if (err){
            res.send("error")
        } else {
            connection.query("DELETE FROM legs WHERE legs.trip_id = '"+trip_id+"'", function(err, results) {
                if (err){
                    res.send("error")
                } else {
                    /*connection.destroy()*/
                    res.send("success")
                }
            })
        }
    })
})

router.get('/api/trips/all', function(req, res) {
    
    function doesTripExist(arr, id){
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].trip_id == id) {
                return i
            }
        }
        return -1
    }
    
    var user_id = req.query.user_id
    connection.query("SELECT * FROM trips INNER JOIN legs ON trips.trip_id = legs.trip_id where trips.user_id = '"+user_id+"'", function(err, results) {
        
        if (!err){
        
            var trips = []
        
            for (var i = 0; i < results.length; i++){
                var j = doesTripExist(trips, results[i].trip_id);
                if (j > -1){
                    var leg = {
                        leg_id: results[i].leg_id,
                        date: results[i].date,
                        start_name: results[i].start_name,
                        start_id: results[i].start_id,
                        end_name: results[i].end_name,
                        end_id: results[i].end_id,
                        distance: results[i].distance,
                        stopover: results[i].stopover
                    }
                    trips[j].legs.push(leg)
                } else {
                    var trip = {
                        trip_id: results[i].trip_id,
                        trip_name: results[i].trip_name,
                        legs: [
                            {
                                leg_id: results[i].leg_id,
                                date: results[i].date,
                                start_name: results[i].start_name,
                                start_id: results[i].start_id,
                                end_name: results[i].end_name,
                                end_id: results[i].end_id,
                                distance: results[i].distance,
                                stopover: results[i].stopover
                            }    
                        ]
                    }
                    
                    trips.push(trip)
                }
            }
        
            res.send(trips)
            /*connection.destroy()*/
        }
    })
})

router.post("/api/trips/new", function (req, res) {
    
    var data = req.body.data
    
    console.log(req.body)
    
    var trip_name = data.trip_name
    var legs = data.legs
    

    connection.query("insert into trips (trip_name, user_id) values ('"+trip_name+"','"+req.body.user_id+"')", function(err, results) {
        if (!err){
            
            var trip_id = results.insertId
            console.log(results.insertId)
            for (var i = 0; i < legs.length; i++){
                connection.query("insert into legs (trip_id, date, start_name, start_id, end_name, end_id, distance, stopover) values ('"+trip_id+"','"+legs[i].date+"','"+legs[i].start_name+"','"+legs[i].start_id+"','"+legs[i].end_name+"','"+legs[i].end_id+"','"+legs[i].distance+"','"+legs[i].stopover+"')", function(err, results) {
                    if (!err) {
                    }
                    /*connection.destroy()*/
                })
            }
            /*connection.destroy()*/
            res.send({trip_id: trip_id});
        }
    })
})

router.post("/api/wishlist/new", function(req, res) {
    var data = req.body.data
    
    var user_id = req.body.user_id
    
    connection.query("insert into wishlist (user_id, wishlist_name, location_name, location_id, completed, date) values ( ?, ?, ?, ?, ?, ?)", [user_id, data.wishlist_name, data.location_name, data.location_id, data.completed, data.date], function(error,results){
        if (!error) {
            res.send(""+results.insertId)
        }
    })
})

router.get("/api/wishlist/all", function(req, res) {
    var user_id = req.query.user_id
    
    connection.query("select * from wishlist where user_id = ?", [user_id], function(error, results) {
        if (!error){
            res.send(results)
        }
    })
})

router.post('/api/wishlist/check', function(req, res) {
    var wishlist_id = req.body.wishlist_id
    var date = req.body.date
    
    connection.query("update wishlist set completed=1, date=? where wishlist_id=?",[date, wishlist_id], function(error, results) {
        if (!error) {
            res.send(results)
        }
    })
})

router.get('/api/wishlist/delete', function(req, res) {
    var wishlist_id = req.query.wishlist_id
    
    connection.query('delete from wishlist where wishlist_id = ?', [wishlist_id], function(error, results) {
        if (!error) {
            res.send(results)
        }
    })
})

router.get("/api/distance", function(req, res) {
    var start = req.query.start_id;
    var end = req.query.end_id;
    request("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:"+start+"&destinations=place_id:"+end+"&key=AIzaSyC_G4Kiyr-mBiXXUaX4b_48z3oInEQBX3g", function(error, response, body){
        res.send(body)   
    })
})


module.exports = router;
