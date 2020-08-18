const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb+srv://root:15666816Hira@cluster0.cq4vw.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true,useUnifiedTopology: true});

  mongoose.connection.on('open', () => {
    // console.log('MongoDB: Connected');
  });
  mongoose.connection.on('error', (err) => {
    console.log('MongoDB: Error', err);
  });
  mongoose.Promise = global.Promise;
};
