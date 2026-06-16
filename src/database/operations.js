const path = require('path');
const {
  generateAvatarFileName
} = require('../utils/user.util.js')

const supabase = require('./config.js');

async function insert(tableName, payload) 
{
  try 
  {
        const { data, error } = await supabase
                                        .from(tableName)
                                        .insert(payload)
                                        .select();

        if (error) 
        {
            console.error('Supabase error:', error.message);
            return null;
        }

    return data;
  } 
  catch (error) 
  {
    console.error('Execution error:', error.message);
    return null;
  }
}

async function fetch( tableName, columns="*")
{
    try 
  {
        const { data, error } = await supabase
                                        .from(tableName)
                                        .select(columns);

        if (error) 
        {
            console.error('Supabase error:', error.message);
            return null;
        }

    return data;
  } 
  catch (error) 
  {
    console.error('Execution error:', error.message);
    return null;
  }
}

async function fetchByCondition( tableName,columns="*" , conditionCol, conditionVal) 
{
    try
    {
        const {data,error} = await supabase
                                    .from(tableName)
                                    .select(columns)
                                    .eq(conditionCol,conditionVal)
                                    .single();

        if( error )
        {
          console.log(error);
          
          return null;
        }

        return data;
    }
    catch(err)
    {
      console.log(err);
      
      return null;
    }
  
}

async function uploadAvatar( avatar )
{
    if( !avatar ) return null;

    const filename = generateAvatarFileName( avatar.originalname );

    try
    {
      const { data , error } = await supabase.storage
                                  .from('user-avatars')
                                  .upload( `/avatars/${filename}` , avatar.buffer , {
                                      contentType: avatar.mimetype
                                    } )
      if( error )
      {
        console.log(error);
        return null;
      }
      
      return data;
    }
    catch(err)
    {
      console.log(err);
      return null;
    }
}

async function fetchAvatar(bucketName , url) 
{
    try
    {
        const { data , error } = await supabase.storage
                                        .from(bucketName)
                                        .getPublicUrl(url);

        if( error )
        {
          console.log(error);
          return null;
        }

        return data;
    }
    catch(err)
    {
      console.log(err);
      return null;
    }
}

async function deleteAvatar( bucketName , url ) 
{
    try
    {
        const { data , error } = await supabase.storage
                                        .from(bucketName)
                                        .remove([url]);
                                        
        if( error )
        {
          console.log(error);
          return null;
        }

        return data;
    }
    catch(err)
    {
      console.log(err);
      return null;
    }
}

async function updateUser( tableName , paylpoad , id ) 
{
  try
  {
     const { data , error } = await supabase  
                                    .from(tableName)
                                    .update(paylpoad)
                                    .eq( 'id' , id );
      if( error )
      {
        console.log(error);
        return null;
      }

      return data;
  } 
  catch (err) 
  {
      console.log(err);
      return null;  
  }
}

module.exports = {
    insert,
    fetch,
    uploadAvatar,
    fetchByCondition,
    fetchAvatar,
    deleteAvatar,
    updateUser
}