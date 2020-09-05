const express = require('express');
const router = express.Router();

// Models

const Movie = require('../model/Movie');
// list
router.get('/',(req,res,next)=>{
  const promise = Movie.aggregate([
    {
      $lookup:{
        from:'directors',
        localField:'director_id',
        foreignField:'_id',
        as:'director'
      }
    },
    {
      $unwind:'$director'
    }
  ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  })
});
// top 10 list
router.get('/top10',(req,res,next)=>{
  const promise = Movie.find({ }).limit(10).sort({imdb_score:-1});
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  })
});
// find
router.get('/:movie_id',(req,res,next)=>{
  const promise = Movie.findById(req.params.movie_id);
  promise.then((data)=>{
    if (!data)
      next({ message: 'The movie was not found.',code:99 });
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});
// Between
router.get('/between/:start_year/:end_year',(req,res,next)=>{
  const {start_year,end_year} = req.params;
  const promise = Movie.find(
    {
      year:{
        "$gte":parseInt(start_year),
        "$lte":parseInt(end_year)
      }
    }
  );
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  })
});
// update
router.put('/:movie_id',(req,res,next)=>{
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id,
    req.body,
    {
      new:true
    }
  );
  promise.then((data)=>{
    if (!data)
      next({ message: 'The movie was not found.',code:99 });
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});
// delete
router.delete('/:movie_id',(req,res,next)=>{
  const promise = Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((data)=>{
    if (!data)
      next({ message: 'The movie was not found.',code:99 });
    res.json({status:1});
  }).catch((err)=>{
    res.json(err);
  });
});

router.post('/', (req, res, next) =>{
  const {title,imdb_score,category,country,year} = req.body;
  const movie = new Movie({
      title      : title,
      imdb_score : imdb_score,
      category   : category,
      country    : country,
      year       : year
  });
  const promise = movie.save();
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
