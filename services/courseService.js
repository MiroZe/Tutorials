const Course = require("../models/Course")



async function getAll() {
 return Course.find({}).lean()
}


async function createCourse(data) {

    return Course.create(data)

}

async function getOneById(id) {
    return await Course.findById(id).lean()
}

async function update(data, id) {
    const existingCourse = await Course.findById(id)
    existingCourse.title = data.title
    existingCourse.description = data.description
    existingCourse.imageUrl = data.imageUrl
    existingCourse.duration = data.duration
    
    await existingCourse.save()
}


async function deleteById(id) {
 await Course.findByIdAndRemove(id)
}


async function enroll(courseId, userId) {
    const course = await Course.findById(courseId);
    if (course.enrolledUsers.includes(userId)) {
        throw new Error('You can book twice')
    }
    course.enrolledUsers.push(userId)
    await course.save()
}


async function searchCourse(query) {

    
        const results =  await Course.find({title : { $regex: new RegExp(query, 'i') }}).lean()
        return results

  
}

module.exports = {
    getAll,
    getOneById,
    update,
    deleteById,
    createCourse,
    enroll,
    searchCourse
}