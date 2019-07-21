var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require("./profile");
var Problem = require("./problems");

router.get('/', function (req, res, next) {
  res.render('check');
});

router.get('/reg/phone', function (req, res) {
  var number_phone = req.query.phone;
  User.findOne({ 'phone': req.query.phone }, (err, re) => {
    if (re != null) {
      User.findOneAndUpdate({ 'phone': req.query.phone }, { 'verify': '00000' }, { safe: true, upsert: true }, function (err, doc) { });
      console.log(err, re);
      res.send("OK_AGAIN");
      return;
    }
    var newUser = new User();
    newUser.phone = number_phone;
    newUser.save();
    res.send('OK');
  });
});

router.get('/reg/verify', function (req, res) {
  User.findOne({ 'phone': req.query.number }, (err, re) => {
    if (re == null) {
      res.send('USER_NOT_FOUND');
    } else if (req.query.code == re.verify) {
      res.send('OK');
    } else {
      res.send('WRONG_CODE');
    }
  })
});

router.get('/add/fio', function (req, res) {
  var fio = [req.query.f_name, req.query.s_name, req.query.t_name];
  if (fio[0] == "" || fio[1] == "" || fio[2] == "") {
    res.send("ERROR_EMPTY_FIELDS");
  } else {
    User.findOne({ 'phone': req.query.number }, (err, re) => {
      console.log(err, re);
      if (re == null) {
        res.send('USER_NOT_FOUND');
      } else {
        User.findOneAndUpdate({ 'phone': req.query.number }, { 'f_name': fio[0], 's_name': fio[1], 't_name': fio[2] }, { safe: true, upsert: true }, function (err, doc) { });
        res.send('OK');
      }
    });
  }
});

router.get('/create_problem', function (req, res) {
  var number = req.query.number;

  User.findOne({ 'phone': number }, (err, re) => {
    if (re == null) {
      res.send('USER_NOT_FOUND');
      return;
    }
    var lat = req.query.lat;
    var lon = req.query.lon;
    var name = req.query.name;
    var discr = req.query.discr;
    var users = [number];
    var type = req.query.type;
    console.log(req.query);
    var newProblem = new Problem();
    newProblem.lat = lat;
    newProblem.lon = lon;
    newProblem.name = name;
    newProblem.discr = discr;
    newProblem.users = users;
    newProblem.type = type;
    console.log(newProblem);
    newProblem.save(function (err, re) {
      var id = re._id;
      var arr = re.problems;
      if (arr == undefined) {
        arr = [];
      }
      arr.push(id);
      User.findOneAndUpdate({ 'phone': req.query.number }, { "problems": arr }, { safe: true, upsert: true }, function (err, doc) { });
      res.send('OK');
    });
  });
});

router.get('/take_all_points', function (req, res) {
  Problem.find((err, re) => {
    res.json(re);
  })
});

router.get('/take_point/:id', function (req, res) {
  var id = req.params.id;
  Problem.findOne({ '_id': id }, function (err, re) {
    if (re == null) {
      res.send('POINT_NOT_FOUND');
    } else {
      res.send(re);
    }
  });
});

router.get('/take_profile/:number', function (req, res) {
  User.findOne({ 'phone': req.params.number }, (err, re) => {
    if (re == null) {
      res.send('USER_NOT_FOUND');
    } else {
      res.send(re);
    }
  })
});

router.get('/map', function (req, res) {
  Problem.find((err, re) => {
    console.log(re);
    var points = [];
    for (i = 0; i < re.length; i++)points.push(re[i]);
    if (re.length < 1) {
      res.render('index', { 'points': ['empty'] });
    } else
      res.render('index', { 'points': points });
  });
});

module.exports = router;