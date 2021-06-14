const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const axios = require("axios").default;
const moment = require("moment");
const config = require("./config");
const User = require("./models/user");
const Course = require("./models/course");
const path = require('path');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

(async function () {
    const PORT = process.env.PORT || 5500;
	const buildPath = path.join(__dirname, '..', 'build');
	app.use(express.static(buildPath));

    const usersSignup = [];
    const dbUri = `mongodb+srv://${config.databaseUser}:${config.databasePassword}@cluster0.tvwdp.mongodb.net/GradingDB?retryWrites=true&w=majority`;
    await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });

    // Login
    app.post("/login", async function (req, res) {
        usn = req.body.username
        pwd = req.body.password

        try {
            const user = await User.findOne({
                username: usn
            });

            if (!user) {
                console.log("Non-Existent Username!")
                return res.sendStatus(401);
            }

            const valid = user.password == pwd;
            if (!valid) {
                console.log("Wrong Password!")
                return res.sendStatus(401);
            }
            const role = (user.role == 0) ? 'student' : 'staff';
            res.json({
                status: role,
                courses: user.courses,
                phone: user.phone,
                email: user.email
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Settings: Update Password
    app.post("/settings/updatePassword", async function (req, res) {
        usn = req.body.username
        currentPwd = req.body.currentPwd
        newPwd = req.body.newPwd

        try {
            const user = await User.findOne({
                username: usn
            });

            if (!user) {
                console.log("Non-Existent Username!")
                return res.sendStatus(401);
            }

            const valid = user.password == currentPwd;
            if (!valid) {
                console.log("Wrong Password!")
                return res.sendStatus(401);
            }

            user.password = newPwd;
            await user.save();
            res.json({});
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Settings: Update Info
    app.post("/settings/updateInfo", async function (req, res) {
        usn = req.body.username
        email = req.body.email
        phone = req.body.phone

        try {
            const user = await User.findOne({
                username: usn
            });

            if (!user) {
                console.log("Non-Existent Username!")
                return res.sendStatus(401);
            }

            if (email != '') {
                user.email = email;
            }
            if (phone != '') {
                user.phone = phone;
            }
            await user.save();
            res.json({
                phone: user.phone,
                email: user.email
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // View Grades Table
    app.post("/viewGrades", async function (req, res) {
        usn = req.body.username;
        iter = 1;
        try {
            const courses = await Course.find({});
            let result = "[";

            if (!courses) {
                console.log("No Courses!")
                return res.sendStatus(401);
            }

            for (const course in courses) {
                let students = courses[course].students;
                if (students.includes(usn)) {
                    let idx = students.indexOf(usn);
                    let course_number = courses[course].course;
                    let lab_grades = courses[course].lab_grades[idx];
                    let hw_grades = courses[course].hw_grades[idx];
                    for (const grade in lab_grades) {
                        if (result.length !== 1) {
                            result = result + ',';
                        }
                        result = result + '{"id":' + iter + ', "course":"' + course_number + '", "type": "Lab", "grade":' + lab_grades[grade] + '}';
                        iter = iter + 1;
                    }

                    for (const grade in hw_grades) {
                        if (result.length !== 1) {
                            result = result + ',';
                        }
                        result = result + '{"id":' + iter + ', "course":"' + course_number + '", "type": "Homework", "grade":' + hw_grades[grade] + '}';
                        iter = iter + 1;
                    }
                }
            }

            result = result + "]";
            res.json(result);
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Total Number of Grades
    app.post("/totalGradesCount", async function (req, res) {

        try {
            const courses = await Course.find({});
            let count = 0;

            if (!courses) {
                console.log("No Courses!")
                return res.sendStatus(401);
            }

            for (const course in courses) {
                let students = courses[course].students;
                for (const idx in students) {
                    let course_number = courses[course].course;
                    let lab_grades = courses[course].lab_grades[idx];
                    let hw_grades = courses[course].hw_grades[idx];
                    for (const grade in lab_grades) {
                        count = count + 1
                    }

                    for (const grade in hw_grades) {
                        count = count + 1
                    }
                }
            }

            res.json(count);
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Student List
    app.post("/studentList", async function (req, res) {
        try {
            const courses = await Course.find({});
            let result = [];

            if (!courses) {
                console.log("No Courses!")
                return res.sendStatus(401);
            }

            for (const course in courses) {
                let students = courses[course].students;
                result.push(...students);
            }

            result = JSON.stringify({
                students: [...new Set(result)]
            });
            res.json({
                result
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Student List by Courses
    app.post("/studentsInCourse", async function (req, res) {
        let course_number = req.body.course;

        try {
            const course = await Course.findOne({course: course_number});
            let result = JSON.stringify({students: course.students});
            res.json({
                result
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Student List by Courses
    app.post("/addGrade", async function (req, res) {
        let username = req.body.username;
        let course_number = req.body.course;
        let type = req.body.type;
        let grade = req.body.grade;

        try {
            let course = await Course.findOne({course: course_number});
            
            // Build HW_GRADES and LAB_GRADES accordingly
            let students = course.students;
            let idx = students.indexOf(username);
            let hwg = course.hw_grades[idx];
            let lg = course.lab_grades[idx];

            if (type === "Homework") {
                hwg.push(+grade);
            }
            else {
                lg.push(+grade);
            }

            await Course.updateOne({course: course_number}, {hw_grades: course.hw_grades, lab_grades: course.lab_grades});
            
            res.json({
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Student List by Courses
    app.post("/updateGrade", async function (req, res) {
        let username = req.body.username;
        let course_number = req.body.course;
        let type = req.body.type;
        let grade = req.body.grade;
        let org_grade = req.body.org_grade;

        try {
            let course = await Course.findOne({course: course_number});
            
            // Build HW_GRADES and LAB_GRADES accordingly
            let students = course.students;
            let idx = students.indexOf(username);
            let hwg = course.hw_grades[idx];
            let lg = course.lab_grades[idx];
            
            if (type === "Homework") {
                let index = hwg.indexOf(+org_grade);
                hwg[index] = +grade;
            }
            else {
                let index = lg.indexOf(+org_grade);
                lg[index] = +grade;
            }

            await Course.updateOne({course: course_number}, {hw_grades: course.hw_grades, lab_grades: course.lab_grades});
            
            res.json({
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    // Student List by Courses
    app.post("/removeGrade", async function (req, res) {
        let username = req.body.username;
        let course_number = req.body.course;
        let type = req.body.type;
        let grade = req.body.grade;

        try {
            let course = await Course.findOne({course: course_number});
            
            // Build HW_GRADES and LAB_GRADES accordingly
            let students = course.students;
            let idx = students.indexOf(username);
            let hwg = course.hw_grades[idx];
            let lg = course.lab_grades[idx];

            if (type === "Homework") {
                let index = hwg.indexOf(+grade);
                hwg.splice(index, 1);
            }
            else {
                let index = lg.indexOf(+grade);
                lg.splice(index, 1);
            }

            await Course.updateOne({course: course_number}, {hw_grades: course.hw_grades, lab_grades: course.lab_grades});
            
            res.json({
            });
        } catch (err) {
            console.log("error" + err);
            res.sendStatus(500);
        }
    });

    //listening to port 5500
    app.listen(PORT);
    console.log("listening....");
})();