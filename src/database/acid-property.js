 const supabase = require('./config.js')

async function allOrNone( payload ) 
{
    try 
    {
        // Call the database function to handle all inserts atomically
        const { data, error } = await supabase.rpc('execute_money_transfer', payload );

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

module.exports = { 
    allOrNone
}