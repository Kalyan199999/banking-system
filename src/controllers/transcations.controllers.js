const crypto = require('crypto')

const {
    fetchBankAccount
} = require('../database/account.operations.js');

const {
    allOrNone,
    fetchBalance
} = require('../database/acid-property.js')

const {
    fetchLedgerTranscation
} = require('../database/transcation.operations.js')

async function addNewTranscation( request , response ) 
{
    try
    {
        // get the receiver and amount to send
        const { receiver , amount } = request.body;
        if( !receiver || !amount )
        {
            return response.status(400).json({
                ok:false,
                message:"Need the Receiver and amount!"
            })
        }

        const numericAmount = Number(amount.toString().trim());
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return response.status(400).json({
                ok: false,
                message: "Invalid transaction amount!"
            });
        }

        const { id:user_id } = request.user;

        // Get the sender account details
        const sender = await fetchBankAccount( 'user_id' , user_id );
        if( !sender || !sender.id )
        {
            return response.status(400).json({
                ok:false,
                message:"Sender has no bank account!"
            })
        }

        const receiverDetails = await fetchBankAccount( 'id' , receiver );
        if( !receiverDetails || !receiverDetails.id )
        {
            return response.status(400).json({
                ok:false,
                message:"Reciver account has not found!"
            })
        }

        if( sender.id === receiverDetails.id )
        {
            return response.status(400).json({
                ok:false,
                message:"Sender and Reciver can not be same!"
            })
        }

        const balance = await fetchBalance( sender.id );

        if(  balance <=0 )
        {
            return response.status(200).json({
                ok:true,
                message:"Insufficient Balance!"
            })
        }

        const transaction_id = crypto.randomUUID();

        const payload = {
            p_tx_id: transaction_id,
            p_sender_account_id: sender.id,
            p_receiver_account_id: receiverDetails.id,
            p_amount: numericAmount
        }

        const data = await allOrNone( payload );

        if( !data )
        {
            return response.status(400).json({
                ok: false,
                message: "Transaction failed safely without changes."
            });
        }
        
        return response.status(201).json({
            ok:true,
            message:"Transcation is completed!",
            transaction_id
        })

    }
    catch(error)
    {
        return response.status(500).json({
            ok:false,
            message:"Internal server issue!",
            error:error.message
        })
    }
    
}


async function getBalance(  request,response ) 
{
    try 
    {
        const { id:user_id } = request.user;

        const account = await fetchBankAccount( 'user_id' , user_id );

        if( !account )
        {
            return response.status(400).json({
                ok:false,
                message:"No Bank account is found for the user!"
            })
        }

        const balance = await fetchBalance( account.id );

        return response.status(200).json({
            ok:true,
            account,
            balance
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

async function fetchUserTranscations( request, response )
{
    try
    {
        const { id:user_id } = request.user;

        const account = await fetchBankAccount( 'user_id' , user_id );

        if( !account )
        {
            return response.status(400).json({
                ok:false,
                message:"User has no bank account!"
            })
        }

        const ledgerEntries = await fetchLedgerTranscation( account.id  ) || [] ;
       
 
        return response.status(200).json({
            ok:true,
            message:"Fetched all transcations!",
            data:{
                account_id:account.id,
                transcations:ledgerEntries
            }
        })
    }
    catch(error)
    {
        console.log(error);
        
        return response.status(500).json({
            ok:false,
            message:"Internal server issue!",
            error:error.message
        })
    }
}



module.exports = {
    addNewTranscation,
    getBalance,
    fetchUserTranscations
}