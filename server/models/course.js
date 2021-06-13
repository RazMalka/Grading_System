const mongoose = require("mongoose");

let Course = mongoose.model("Course", {
    course: { type: String, required: true, unique: true },
    lab_grades: { type: Array, required: true },
    hw_grades: { type: Array, required: true },
    students: { type: Array, required: true },
}, 'Courses');

module.exports = Course;