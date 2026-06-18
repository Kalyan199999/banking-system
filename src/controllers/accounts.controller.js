const crypto = require('crypto')

const {
    insertAccount,
    fetchAccount
} = require('../database/account.operations.js')

async function craeteNewAcctount( request , response ) 
{   
    try
    {
        const { id:user_id } = request.user;

        const id = crypto.randomUUID();

        const status = 'ACTIVE';

        const account = {
            id:id,
            user_id:user_id,
            status:status
        }
        
        const acc = await insertAccount( account );

        if( !acc )
        {
            console.log(acc);
            
            return response.status(400).json({
                ok:false,
                message:"Account creation is failed!"
            })
        }

        return response.status(201).json({
            ok:true,
            message:"Account created successfully!",
            account:acc
        })
    }
    catch(error)
    {
        console.log(error);
        
        return response.status(500).json({
            ok:false,
            message:"Insternal error!",
            error:error.message
        })
    }
}

async function getAccountDetails( request , response ) 
{
    try
    {
        const { id:user_id } = request.user;

        const account = await fetchAccount( user_id );

        if( !account )
        {
            return response.status(400).json({
                ok:false,
                message:"No Account is found!"
            })
        }

        return response.status(200).json({
            ok:true,
            message: account ? "Account is found!" : "No Account is found!",
            account
        })

    }   
    catch(error)
    {
        console.log(error);
        
        return response.status(500).json({
            ok:false,
            message:"Internal server issue!"
        })
    }
}


module.exports = {
    craeteNewAcctount,
    getAccountDetails
}