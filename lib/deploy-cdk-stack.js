// const { Stack, Duration } = require('aws-cdk-lib')
const cdk = require('@aws-cdk/core')
const lambda = require('@aws-cdk/aws-lambda')
const db = require('@aws-cdk/aws-dynamodb')
const apigw = require('@aws-cdk/aws-apigateway')

class DeployCdkStack extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
    //dynamodb
    const table = new db.Table(this,"DeployTable",{
      partitionKey : {
        name : 'name',
        type : db.AttributeType.STRING
      }
    })

    //lambda
    const handler = new lambda.Function(this,"DeployHandler",{
      runtime: lambda.Runtime.NODEJS_12_X,
      code:lambda.Code.fromAsset("src"),
      handler : "lambda.handler"
    })

    //api gateway
    const api = new apigw.RestApi(this,"Deploy-api")
    const lambdaIntegration = new apigw.LambdaIntegration(handler)
    const deploy = api.root.addResource('deploy')
    deploy.addMethod('GET',lambdaIntegration)
    deploy.addMethod('POST',lambdaIntegration)

    //permissions to lambda for accessing db
    table.grantReadWriteData(handler)

    //env
    handler.addEnvironment('Db',table.tableName)
  }
}

module.exports = { DeployCdkStack }
