const supabase = require('./config.js')

async function newTranscation( transcationPayload ) 
{
    try
    {
        const { data , error } = await supabase
                                        .from('transactions')
                                        .insert(transcationPayload)
                                        .select()
                                        .single();
        if( error )
        {
            console.log(error);
            
            return null;
        }

        return data;
    }
    catch(error)
    {
        console.log(error);
        
        return null;
    }
}


async function fetchAllTranscations( account_id ) 
{
    try
    {
        const { data, error } = await supabase
                                        .from('transactions')
                                        .select(`id`)
                                        .or(`from_user.eq.${account_id}, to_user.eq.${account_id}`);

        if( error )
        {
            return null;
        }

        return data;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
    
}

async function fetchLedgerTranscation( account_id ) 
{
    try
    {
        const { data , error } = await supabase
                                        .from('ledger')
                                        .select('id,amount,transaction_id,type,created_at')
                                        .eq( 'account_id' , account_id)
                                        .order('created_at', { ascending: false });

        if( error )
        {
            console.log(error);
            
            return null;
        }

        return data;
    }
    catch(error)
    {
        console.log(error);
        
        return null;
    }
}

module.exports = {
    newTranscation,
    fetchAllTranscations,
    fetchLedgerTranscation
}