import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    UpdateCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);



export const handler = async (event) => {
    let body;
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    var dateTTL = new Date();
    dateTTL.setMinutes(dateTTL.getMinutes() + 10);
    var timeStampTTL = (Math.floor(dateTTL / 1000));

    await main();
    /////////////////////////////////////////////////////// main ////////////////////////////////////////////////////
    async function main() {
        try {
            await saveDataDynamoDB();
        }
        catch (ex) {
            console.log("Catch == >>> " + ex)
        }
    }

    async function saveDataDynamoDB() {
        console.log("AAAAAA")
        try {

            body = await dynamo.send(
                new UpdateCommand({
                    TableName: "STREET-LIGHT-CHECK-CONTROL",
                    Key: {
                        "PROJECT": event.PROJECT,
                        "GROUP_CODE": "ALL"
                    },
                    UpdateExpression: "set #LAST_STATUS=:LAST_STATUS , #SW= :SW ,#DIM= :DIM , #TTL_FIELD_EXPIRE =:TTL_FIELD_EXPIRE",
                    ExpressionAttributeNames: {
                        "#LAST_STATUS": "LAST_STATUS",
                        "#SW": "SW",
                        "#DIM": "DIM",
                        "#TTL_FIELD_EXPIRE": "TTL_FIELD_EXPIRE"
                    },
                    ExpressionAttributeValues: {
                        ":LAST_STATUS": "START",
                        ":SW": event.SW + "",
                        ":DIM": event.DIM + "",
                        ":TTL_FIELD_EXPIRE": timeStampTTL
                    }
                })
            );
        }
        catch (ex) {
            console.log("EEE" + ex)

        }

        console.log("DDDDD")
        console.log(body.Item)
    }

    return body;
};
