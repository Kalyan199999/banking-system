 const supabase = require('./config.js')

async function allOrNone( function_name, payload ) 
{
    try 
    {
        // Call the database function to handle all inserts atomically
        const { data, error } = await supabase.rpc(function_name, payload );

        if (error) {
            
            console.error("Supabase RPC Execution Error:", error.message);
            return false;
        }

        console.log("RPC Success Result:", data);
        
        return true;
    } 
    catch (error)
    {
       console.error("Catch Block Database Error:", error);
        return false;   
    }
}

async function fetchBalance( account_id ) 
{
    try 
    {
        const { data, error } = await supabase
                                        .from('ledger')
                                        .select('amount, type') // Fetch both amount and type
                                        .eq('account_id', account_id)
                                        .in('type', ['CREDIT', 'DEBIT', 'WITHDRAW' ,'DEPOSIT']); // Matches ANY of these types

        if( error )
        {
            console.log(error);
            
            return 0;
        }

        console.log(data);
        
        const balance = data.reduce( ( acc , record )=>{

            return acc+record.amount
        }  ,0 )

        return balance;
                                                            
    } 
    catch (error) 
    {
        console.log(error);
        
        return 0;
    }   
}

module.exports = { 
    allOrNone,
    fetchBalance
}