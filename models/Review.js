const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add a description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Static method to get average of course tuitions
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  // console.log('Calculating average cost...'.blue);
  const obj = await this.aggregate([
    {
      $match: {bootcamp: bootcampId}
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: {$avg: '$rating'}
      }
    }
  ]);

  // insert averageCost to the DB
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: Math.ceil(obj[0].averageRating / 10) *10
    });
  } catch (err) {
    console.error(err);
  }
  
  // console.log(obj);
};

// Call getAverageCost after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
