const {
    supabase
} = require('./config.js')

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

module.exports = {
    newTranscation
}