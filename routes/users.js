const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/Users');
const app = require('../app');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});


/* GET users listing. */
router.post('/', (req, res, next) =>{
  const {username,password} = req.body;
  bcrypt.hash(password, 10).then(function(hash) {
    const user = new User({
      username,
      password:hash
    });
    const promise = user.save();
    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  User.findOne({username}).then((data)=>{
    if(!data){
      res.json({
				status: false,
				message: 'Authentication failed, user not found.'
			});
    }else{
      bcrypt.compare(password, data.password).then((result) => {
				if (!result){
					res.json({
						status: false,
						message: 'Authentication failed, wrong password.'
					});
				}else{
					const payload = {username};
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {expiresIn: 720 /* 12 saat */});
					res.json({
						status: true,
						token
					});
				}
			});
    }
  }).catch((err)=>{
    res.json(err);
  });
});
module.exports = router;
