const {
    supabase
} = require('./config.js')

async function addNewLedgerEntry( payload )
{
    try
    {
        const { data , error } = await supabase
                                        .from( 'ledger' )
                                        .insert( payload )
                                        .select()
                                        .singel();


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
    addNewLedgerEntry
}