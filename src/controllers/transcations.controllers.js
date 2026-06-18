const crypto = require('crypto')

const {
    fetchBankAccount
} = require('../database/account.operations.js');

const {
    allOrNone
} = require('../database/acid-property.js')

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

module.exports = {
    addNewTranscation
}



// const transcationPayload = {
//                 id:transaction_id,
//                 from_user:sender,
//                 to_user:receiver,
//                 amount:numericAmount
//         };

//         const transactionData = await newTranscation( transcationPayload );

//         const senderPayload = {
//             account_id:sender,
//             amount:numericAmount,
//             transaction_id:transaction_id,
//             type:"DEBIT"
//         }

//         const receiverPayload = {
//             account_id:receiver,
//             amount:numericAmount,
//             transaction_id:transaction_id,
//             type:"CREDIT"
//         }

//         const senderData = await addNewLedgerEntry( senderPayload );
//         const receiverData = await addNewLedgerEntry( receiverPayload );

//         if( !senderData || !receiverData)
//         {
//             return response.status(400).json({
//                 ok:false,
//                 message:"Transcation is Failed!"
//             })
//         }

//         console.log(transactionData);
//         console.log(senderData);
//         console.log(receiverData);