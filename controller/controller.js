const pool = require("../database/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const userSignup = async(req, res) => {

    const {username, email, password} = req.body;

    try {
        let text, values;

        text = `SELECT * FROM users WHERE email = $1`;
        values = [email];

        const existuser = await pool.query(text, values);

        if(existuser.rows.length > 0) {
            res.status(400).send({success: false, message: "This user is already stored !!"});
        }
        else {
            ("Inside else");
            const hashedPassword = await bcrypt.hash(password, 10);
            (hashedPassword, 'hasing password :::');

            text = `INSERT INTO users (username, email, password) values ($1, $2, $3)`
            values = [username, email, hashedPassword];

            (text, values, 'inside else :::::')
            const userDetails = await pool.query(text, values);
            res.status(200).send({success: true, message: "User registered successfully", data: userDetails.rows});
        }
    } catch (error) {
        (error, 'error while sign up');
        res.status(400).send({ success: false, message: "error while sign up", error: error });
    }

}

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let text, values;

        text = `SELECT * FROM users WHERE email = $1`;
        values = [email];
        const checkData = await pool.query(text, values);

        if (checkData.rows.length === 0) {
            ("Invalid Cridentials");
            res.status(400).send({ success: false, message: "Invalid Cridentials" });
        }
        else {
            const user = checkData.rows[0];
            (user, '<<<<<<<<<<<')
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                ("Invalid username and password, please try again");
                res.status(400).send({ success: false, message: "Invalid username and password" });
            }

            else {
                const token = jwt.sign({ id: user.id, email: user.email}, 'abcdefghijklmnopqrstuvwxyz', { expiresIn: '1h' });
                (token, 'token ::::');
                res.status(200).send({ success: true, token: token });
            }
        }
    } catch (error) {
        (error, 'error here ::::');
        res.status(400).send({ success: false, message: "Error while login", error: error });
    }
}


const AlluserDetails = async (req, res) => {
    let text, values;
    try {
        text = `SELECT id, username, email FROM users WHERE id = $1`;
        values = [req.user.id];

        const userData = await pool.query(text, values);

        if (userData.rows.length === 0) {
            return res.status(400).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, message: "User Data", data: userData.rows[0] });
    } catch (error) {
        console.log(error, 'error here ::::');
        res.status(400).send({ success: false, message: "Error while getting user details", error: error });
    }
}


const getUserById = async(req, res) => {
    const id = req.params.id;
    let text, values;
    try {

        text = `SELECT * FROM users WHERE id = $1`
        values = [id];

        const idNotExists = await pool.query(text, values);

        if(idNotExists.rows.length === 0) {
            res.status(400).send({ success: false, message: `This id ${id} is not available right now` });
        }
        else {
            const userbyid = await pool.query(text, values);
            res.status(200).send({success: true, message: "UserByID Details Fetched", data: userbyid.rows});
        }

        
    } catch (error) {
        res.status(400).send({ success: false, message: "Error while getting user details", error: error });
     }
}

const userLogout = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
};

const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.user.id;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const text = `UPDATE users SET password = $1 WHERE id = $2`;
        const values = [hashedPassword, userId];

        await pool.query(text, values);
        res.status(200).send({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(400).send({ success: false, message: "Error while changing password", error: error });
    }
}

module.exports = {
    userSignup,
    userLogin,
    AlluserDetails,
    getUserById,
    userLogout,
    changePassword
}

