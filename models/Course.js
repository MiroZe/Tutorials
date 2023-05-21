const { Schema, model, Types } = require('mongoose');


const URL_PATTERN = /^https?.+$/i;
//const URL_PATTERN = /^https?:\/\/.+$/i;


const courseSchema = new Schema({
    title: { type: String, required: true, minlength: [4, 'Title should be min 4 charactesr long'], unique: true },
    description: { type: String, required: true, minlength: [20, 'Description should be min 20 characters'], maxlength: [50, 'Description should be max 50 characters'] },
    imageUrl: {
        type: String, 
        required: true,
        validate : {validator: (value) => URL_PATTERN.test(value), message: 'Image Url is not valid'}
    },
    duration: { type: String, required: true },
    created: { type: String, required: true },
    enrolledUsers: { type: [Types.ObjectId], ref: 'User', default: [] },
    owner: { type: Types.ObjectId, ref: 'User', required: true }
})

courseSchema.index({ title: 1 }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const Course = model('Course', courseSchema);

module.exports = Course;
