const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const MovieSchema = new Schema({
    director_id:Schema.Types.ObjectId,
    title:{
        type:String,
        require:true
    },
    category:String,
    country:String,
    year:Number,
    imdb_score:Number,
});
module.exports = mongoose.model('movie',MouseEvent);