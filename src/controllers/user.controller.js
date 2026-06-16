const { v4: uuidv4 } = require("uuid");

const {
    generateHashPassword,
    compareHashPassword,
    validateEmail,
    validatePassword,
    validateMobile
} = require('../utils/user.util.js');

const {
    insert,
    // fetch,
    fetchByCondition,
    updateUser,
    uploadAvatar,
    fetchAvatar,
    deleteAvatar
} = require('../database/operations.js');

const {
    generateToken
} = require('../middlewares/auth.json-token.js');

async function registration( request,response )
{
    try
    {
        const { email,
                mobile_number,
                password,
                first_name,
                last_name, 
            } = request.body;

        if( !first_name || !first_name.trim() )
        {
            return response.status(422).json({
                ok:false,
                message:"First Name is required!"
            })
        }

        if( !last_name || !last_name.trim() )
        {
            return response.status(422).json({
                ok:false,
                message:"Last Name is required!"
            })
        }

        const isValidEmail = validateEmail( email.trim() );

        if( !isValidEmail )
        {
            return response.status(422).json({
                ok:false,
                message:"Please provide the valid email"
            })
        }

        const isValidPassword = validatePassword( password );

        if( !isValidPassword )
        {
            return response.status(422).json({
                ok:false,
                message:"Please provide the valid password"
            })
        }

        const isValidMobile = validateMobile( mobile_number );

        if( !isValidMobile )
        {
            return response.status(422).json({
                ok:false,
                message:"Please provide the valid mobile"
            })
        }

        const file = request.file;
        let avatarURL = ""

        if( file )
        {
            const avatar = await uploadAvatar(file);
            
            if( avatar ) avatarURL = avatar.path;
        }

        const hashPassword = generateHashPassword( password );
        const id = uuidv4();

        const user = {
            id:id,
            first_name:first_name.trim(),
            last_name:last_name.trim(),
            email:email.trim(),
            mobile_number:mobile_number,
            password:hashPassword,
            avatar: avatarURL
        }

        const data = await insert('users' , user );

        if( !data )
        {
            return response.status(400).json({
                ok:false,
                message:"User registration is failed!"
            })
        }

        const payload = {
            id:id,
            email:email,
            mobile_number:mobile_number
        }

        const token = generateToken( payload , '1h' );
        
        return response.status(201).json({
            ok:true,
            message:"user registered successfully!",
            data,
            token
        })

    }
    catch(error)
    {
        return response.status(500).json({
            ok:false,
            message:"Internal server issue",
            error:error.message
        })
    }
}

async function login( request,response )
{
    try
    {
        const { email,password } = request.body;

        if( !email || !password)
        {
            return response.status(401).json({
                ok:false,
                message:"Email and Password fields are required!"
            })
        }

        const user = await fetchByCondition( 'users' , "id,first_name,last_name,mobile_number,password,email,avatar" , 'email', email );

        if( !user )
        {
            return response.status(401).json({
                ok:false,
                message:'No user is found with these credientials!'
            })
        }

        const isMatch = compareHashPassword( password , user.password );

        if( !isMatch )
        {
            return response.status(401).json({
                ok:false,
                message:"Invalid Password!"
            })
        }
        
        let avatarPublicUrl = '';

        if( user.avatar && user.avatar.trim().length > 0)
        {
            const image = await fetchAvatar( 'user-avatars' , user.avatar );
            avatarPublicUrl = image.publicUrl;
        }

         const payload = {
            id:user.id,
            email:user.email,
            mobile_number:user.mobile_number
        }

        const token = generateToken( payload , '1h' );

        return response.status(200).json({
            ok:true,
            message:"User found and login Successfully!",
            token,
            user:{
                id:user.id,
                first_name:user.first_name,
                last_name:user.last_name,
                email:user.email,
                mobile_number:user.mobile_number,
                avatar:avatarPublicUrl
            }
        })
    }
    catch
    {
        return response.status(500).json({
            ok:false,
            message:"Internal server issue!",
            error:error.message
        })
    }
    finally
    {
        console.log("Login done!");
    }
}

async function update( request , response )
{
    try 
    {
        const { id } = request.user;

        const { email, mobile_number, first_name, last_name, nick_name } = request.body;

        let user = {};

        if( email )
        {
            const isValidEmail = validateEmail(email.trim());

            if( !isValidEmail )
            {
                return response.status(400).json({
                    ok:false,
                    message:"Provide the valid email to update!"
                })
            }

            user.email = email.trim();
        }

        if( mobile_number )
        {
            const isValidMobile = validateMobile( mobile_number );

            if( !isValidMobile )
            {
                return response.status(400).json({
                    ok:false,
                    message:"Provide the valid Mobile number to update!"
                })
            }

            user.mobile_number = mobile_number;
        }

        if( first_name ) user.first_name = first_name.trim();

        if( last_name ) user.last_name = last_name.trim();

        if( nick_name )  user.nick_name = nick_name.trim();

        const file = request.file;

        if (file) {
            
            const oldRecord = await fetchByCondition('users', 'avatar', 'id', id);
            
            const avatar = await uploadAvatar(file);
            
            if (avatar) { 
                user.avatar = avatar.path;

                if (oldRecord && oldRecord.avatar && oldRecord.avatar.trim().length > 0) 
                {
                    await deleteAvatar('avatars', oldRecord.avatar);
                }
            }
        }

        if (Object.keys(user).length === 0) 
        {
            return response.status(400).json({
                ok: false,
                message: "No fields provided to update."
            });
        }

        user.updated_at = new Date();

        const data = await updateUser('users' , user , id );
        
        return response.status(200).json({
            ok:true,
            message:"Updated successfully!"
        })
    }
    catch (error) 
    {
        return response.status(500).json({
            ok:false,
            message:"Internal server issue!",
            error:error.message
        })   
    }
}

async function forgetPassword(request,response) 
{
    try
    {
        const { email , password } = request.body;

        if( !email || !email.trim() || !password )
        {
            return response.status(400).json({
                ok:false,
                message:"Email and password is required to set the new password!"
            });
        }

        const isValidPassword = validatePassword( password );

        if( !isValidPassword )
        {
            return response.status(400).json({
                ok:false,
                message:"Provide the valid and strong password!"
            });
        }
        
        const user = await fetchByCondition( 'users' , "id" , "email" , email.trim() );

        if( !user || !user.id )
        {
            return response.status(404).json({
                ok:false,
                message:"No user found with the provided email!"
            });
        }

        const hashPassword = generateHashPassword( password );

        const payload = {
            password:hashPassword,
            updated_at:new Date()
        }

        await updateUser('users' , payload , user.id );

        return response.status(200).json({
            ok:true,
            message:"User password is updated!"
        });
    }
    catch(err)
    {
        console.log(err);
        
        return response.status(500).json({
            ok:false,
            message:"Server side issue!"
        });
    }
}

module.exports = {
    registration,
    login,
    update,
    forgetPassword
}