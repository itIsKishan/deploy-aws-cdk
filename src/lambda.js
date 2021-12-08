const aws = require('aws-sdk')
const db = new aws.DynamoDB()

const putData = async (body) =>{
    const {name, email} = JSON.parse(body)
    const params = {
        TableName : process.env.Db,
        Item : {
            name : { S : name},
            email : { S : email}
        }
    }
    let data
    try{
        data = await db.putItem(params).promise()
        let response = {
            statusCode : 200,
            body : JSON.stringify({data : params})
        }
        console.log('success',response)
        return response
    } catch(err){
        return JSON.stringify({error : err})
    }
}

const getData = async (name) =>{
    console.log('id',name)
    const params = {
        TableName : process.env.Db,
        Key : {
            name : { S : name}
        }
    }
    let data 
    try{
        data = await db.getItem(params).promise()
        let response = {
            statusCode : 200,
            body : JSON.stringify(data)
        }
        console.log('success',response)
        return response
    } catch(err){
        return JSON.stringify({error : err})
    }
}

module.exports.handler = async (event,context,callback) =>{
    console.log('event data',event)
    if(event.httpMethod === 'GET' && event.path === '/get_data'){
        console.log('get the item from the table',event.queryStringParameters.name)
        return getData(event.queryStringParameters.name)
    } else if(event.httpMethod === 'POST' && event.path === '/deploy') {
        console.log('create the item in table')
        return putData(event.body)
    }
}

