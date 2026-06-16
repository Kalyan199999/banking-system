const jwt = require('jsonwebtoken')

function generateToken( payload , time )
{
    // Get the secret key
    const key = process.env.JWT_SECRET_KEY;

    // generate the token using jwt
    const token = jwt.sign( payload , key, { expiresIn:time } );

    return token;
}

function verifyToken( token )
{
    // Get the secret key
    const key = process.env.JWT_SECRET_KEY;

    // Verify the given token and get the payload
    const decode = jwt.verify( token , key  );

    return decode;
}

async function authentication( request,response,next ) 
{
    try
    {
        // Get the authentication headers
        const authHeader =  request.headers.authorization

        // Check if the token is provided or not
        if( !authHeader || !authHeader.startsWith('Bearer ') )
        {
            return response.status(401).json({
                ok:false,
                message:"Invalid or no token found!"
            })
        }

        // Fetch the actual token
        const token = authHeader.split('Bearer ')[1];

        // Fetch the payload
        const decode = verifyToken( token );

        // add the payload to the request
        request.user = decode;

        // Move to next middleware or server code
        next();
    }
    catch(error)
    {
        return response.status(500).json({
            ok:false,
            message:"Token verification Failed!",
            error:error.message
        })
    }
    finally
    {
        console.log("Completed the verification of user!");
    }
}


module.exports={
    generateToken,
    authentication
}