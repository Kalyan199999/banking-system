const supabase = require('./config.js')

async function insertAccount( payload ) 
{
    try
    {
        const { data , error } = await supabase
                                        .from('Accounts')
                                        .insert( payload )
                                        .select()
                                        .single();
        if( error )
        {
            console.log(error);
            return null;
        }

        console.log(data);
        
        return data;
    }
    catch(error)
    {
        console.log(error);
        return null;
    }
}

async function fetchAccount(  user_id ) 
{
    try 
    {
        const columns = `id,status,
                        users (         
                            id,                                           
                            first_name,
                            last_name,
                            email,
                            mobile_number
                        )`;
                        
        // fetch the user and account details based on the user id from account table
        const { data , error } = await supabase
                                        .from('Accounts')
                                        .select(columns)
                                        .eq('user_id' , user_id )
                                        .single()
        if( error )
        {
            console.log(error);
            return null;
        }

        return data;
    } 
    catch (error) 
    {
        console.log(error);
        
        return null;   
    }   
}

module.exports = {
    insertAccount,
    fetchAccount
}