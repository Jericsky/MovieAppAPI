const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../auth')

module.exports.registerUser = async (req,res) => {
    try {
        const {firstName, lastName, email, password, mobileNo} = req.body;

        if(!email.includes('@')){
            return res.status(400).send({error: 'Invalid email format'})
        }

        if(password.length < 8){
            return res.status(400).send({error: 'Password must be 8 characters'})
        }

        const existingUser = await User.findOne({email: email});
        console.log(existingUser)
        if(existingUser){
            return res.status(400).send({error: 'Email already exists'})
        }
        
        let newUser = new User({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password,10),
            mobileNo
        })
        console.log(newUser)

        return await newUser.save()
        .then((result) => {
            console.log(result)
            return res.status(201).send({message: 'Registered Successfully'})
        })
        .catch(error => error)
    } catch (error) {
        console.log('Error in register a user: ', error)
        return res.status(500).send({error: 'Internal server error: Failed to register user'});
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email.includes('@')){
            return res.status(400).send({error: 'Invalid email format'})
        }

        const user = await User.findOne({email})
        console.log(user)

        if(!user){
            return res.status(404).send({error: 'No email found'})
        }

        const comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return res.status(404).send({error: 'Email or Password incorrect'})
        }

        const accessToken = auth.createAccess(user);
        console.log(accessToken)
        return res.status(200).send({access: accessToken})
        
    } catch (error) {
        console.log('Error in logging in: ', error)
        return res.status(500).send({error: 'Internal server error: Login failed'})
    }
}