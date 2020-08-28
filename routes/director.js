const express = require('express');
const router = express.Router();

const Director = require('../model/Director');

router.post('/', (req, res, next) =>{
    const director = new Director(req.body);
    const promise = director.save();
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});

router.get('/',(req,res,next)=>{
    const promise = Director.aggregate([
        {
            $lookup: {
				from: 'movies',
				localField: '_id',
				foreignField: 'director_id',
				as: 'movies'
			}
        },
        {
            $unwind:{
                path:'$movies',
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $group:{
                _id:{
                    _id:'$_id',
                    name:'$name',
                    surname:'$surname',
                    bio:'$bio'
                },
                movies:{
                    $push:'$movies'
                }

            }
        }
    ]);
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })
});

module.exports = router;
