const nodemailer = require("nodemailer");
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const forgetPassword = require('../models/password');

exports.getforgetPasswordPage = (req,res)=>{
    res.sendFile('forgetpasswordPage.html', { root: 'views' });
}

exports.getEmailToSendResetLink = async (req,res)=>{

    try {
        const {email} = req.body;
        const user = await User.findOne({email: email});

        if(user){
            const id = uuid.v4();

            await forgetPassword.create({
                id:id,
                active:true,
                userId:user._id
            })

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'brendan.gaylord31@ethereal.email',
                    pass: '4KU7hnqpf2HX3g18Xh'
                }
            });
    
            let info = await transporter.sendMail({
                from: `"The Expense Manager " <${process.env.FROM_ADDRESS}>`,
                to: email, 
                subject: "Reset your password to login back", 
                text: "Please find below link to reset your password and login back",
                html: `<a href="${process.env.WEBSITE_ADDRESS}/forgetPassword/${id}">Reset password</a>`, 
            });
            
            return res.status(200).json({
                message: 'Link to reset your password sent on your email id',
            });

        }else{
            res.status(500).json({error: 'User does not exists'});
        }   
    } catch (error) {
        res.status(500).json({error: 'Error sending link'});
    }
}

exports.resetPassword = async (req,res)=>{
    try {
        const id =  req.params.id;
        
        const forgetPassRequest = await forgetPassword.findById({id:id});
        if(forgetPassRequest){
            // await forgetPassRequest.update({ active: false});
            forgetPassRequest.active = false;
            await forgetPassRequest.save();
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/updatePassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    } catch (error) {
        res.status(500).json({error: 'Link is expired'});
    }
}

exports.updatePassword = async (req,res)=>{
    try {
        const {newpassword} = req.query;
        const id = req.params.id;

        const resetPassReq = await forgetPassword.findById({id:id});
        if(resetPassReq){
            const user = await User.findById({id:resetPassReq.userId});

            if(user){
                const saltrounds = 10;
                const hashedPassword = await bcrypt.hash(newpassword,saltrounds);

                // await user.update({password:hashedPassword})
                user.password = hashedPassword;
                await user.save();
            }
            
            return res.status(200).json({
                message: 'successfully updated the password, Please Login now!',
            });
        }

    } catch (error) {
        res.status(500).json({error: 'Link is expired'});
    }
}