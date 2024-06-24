import * as AWS from "@aws-sdk";
//var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB.DocumentClient();
var iotdata = new AWS.IotData({ endpoint: 'a3r1s9h5eq66s3-ats.iot.ap-southeast-1.amazonaws.com' });
// Set the region 

AWS.config.region = 'ap-southeast-1';
var projectName = "SMARTSOLAR";
var codeProjectName = "oPIvy3ef9VIT" + projectName;
var SetTimeZone = 7;
exports.handler = function (event, context) {
    var dataResponse = event;
    /////////////////////////////////////////////////// Date Time //////////////////////////////////////////////////
    var dateNew = new Date();
    dateNew.setHours(dateNew.getHours() + SetTimeZone);

    var DATE = dateNew.getFullYear() +
        "-" + ("0" + (dateNew.getMonth() + 1)).slice(-2) +
        "-" + ("0" + dateNew.getDate()).slice(-2)

    var DATE_TIME = dateNew.getFullYear() +
        "-" + ("0" + (dateNew.getMonth() + 1)).slice(-2) +
        "-" + ("0" + dateNew.getDate()).slice(-2) +
        " " + ("0" + dateNew.getHours()).slice(-2) +
        ":" + ("0" + dateNew.getMinutes()).slice(-2) +
        ":" + ("0" + dateNew.getSeconds()).slice(-2);

    var TIME = ("0" + dateNew.getHours()).slice(-2) +
        ":" + ("0" + dateNew.getMinutes()).slice(-2) +
        ":" + ("0" + dateNew.getSeconds()).slice(-2);

    var timeStampThai = (Math.floor(new Date().getTime() / 1000));

    var dateTTL = new Date();
    dateTTL.setDate(dateTTL.getDate() + 5);
    var timeStampTTL = (Math.floor(dateTTL / 1000));

    main();

    /////////////////////////////////////////////////////// main ////////////////////////////////////////////////////
    async function main() {

        try {
            switch (dataResponse.TYPE + '_' + (dataResponse.MODE == undefined ? "" : dataResponse.MODE)) {
                case 'report_all':
                    await updateDevice(dataResponse);
                    await getLogData(dataResponse);
                    break;
                case 'getparam_getgps':
                    await getLocation(dataResponse);
                    break;
                case 'getparam_fwversion':
                    await getFWVersion(dataResponse);
                    break;
                case 'getparam_loadmode':
                    await updateLoadMode(dataResponse);
                    break;
                case 'fristcon_':
                    await registerDevice(dataResponse);
                    break;
                default:
            }
        }
        catch (ex) {
            console.log("Catch == >>> " + ex)
        }
    }
    ///////////////////////////////////////////////// Update Device ///////////////////////////////////////
    async function updateDevice(dataResponse) {

        var paramsUpdate = {
            TableName: "STREET-LIGHT",
            Key: {
                "IMEI": dataResponse.SN
            },
            UpdateExpression: "set #TIMESTAMP=:TIMESTAMP,"
                + "LAST_UPDATE=:LAST_UPDATE,"
                + "VSOLAR=:VSOLAR,"
                + "ISOLAR=:ISOLAR,"
                + "WSOLAR=:WSOLAR,"
                + "VLOAD=:VLOAD,"
                + "ILOAD=:ILOAD,"
                + "WLOAD=:WLOAD,"
                + "VBAT=:VBAT,"
                + "IBAT=:IBAT,"
                + "WBAT=:WBAT,"
                + "LAST_VOLT=:LAST_VOLT,"
                + "LAST_POWER=:LAST_POWER",

            ExpressionAttributeValues: {
                ":TIMESTAMP": timeStampThai,
                ":LAST_UPDATE": DATE_TIME,
                ":VSOLAR": dataResponse.VALUE.SV,
                ":ISOLAR": dataResponse.VALUE.SI,
                ":WSOLAR": dataResponse.VALUE.SW,
                ":VLOAD": dataResponse.VALUE.LV,
                ":ILOAD": dataResponse.VALUE.LI,
                ":WLOAD": dataResponse.VALUE.LW,
                ":VBAT": dataResponse.VALUE.BV,
                ":IBAT": dataResponse.VALUE.BI,
                ":WBAT": dataResponse.VALUE.BW,
                ":LAST_VOLT": dataResponse.VALUE.LV,
                ":LAST_POWER": dataResponse.VALUE.LW
            },
            ExpressionAttributeNames: { "#TIMESTAMP": "TIMESTAMP" }

        };

        //":LAST_VOLT": dataResponse.VALUE.LV == '0.00' ? '50' : dataResponse.VALUE.LV,
        //":LAST_POWER": dataResponse.VALUE.LW == '0.00' ? '50' : dataResponse.VALUE.LW

        dynamo.update(paramsUpdate, function (err, data) {
            if (err) {
                //console.error("Unable to add paramsUpdate. Error JSON:", JSON.stringify(err, null, 2));
                //console.log("9");
            } else {
                //console.log(paramsUpdate);
                //console.log("Added device: paramsUpdate", JSON.stringify(data, null, 2));
                //console.log("10");
            }
        });

    }

    ///////////////////////////////////////////////// Get Log Data//////////////////////////////////////////
    async function getLogData(dataResponse) {
        //var PF = (parseFloat(event.PF) * 1.04).toString();
        //PF = PF.substring(0, 4);

        var params = {
            TableName: "STREET-LIGHT-LOG-SMARTSOLAR",
            Item: {
                TIMESTAMP: timeStampThai,
                IMEI: dataResponse.SN,
                DATE: DATE,
                TIME: TIME,
                DATETIME: DATE_TIME,
                VSOLAR: dataResponse.VALUE.SV,
                ISOLAR: dataResponse.VALUE.SI,
                WSOLAR: dataResponse.VALUE.SW,
                VBAT: dataResponse.VALUE.BV,
                IBAT: dataResponse.VALUE.BI,
                WBAT: dataResponse.VALUE.BW,
                VLOAD: dataResponse.VALUE.LV,
                ILOAD: dataResponse.VALUE.LI,
                WLOAD: dataResponse.VALUE.LW,
                TTL_FIELD_EXPIRE: timeStampTTL,
            },
        };

        if (dataResponse.VALUE.LV !== undefined) {
            dynamo.put(params, function (err, data) {
                if (err) {
                    //console.error("Unable to add params. Error JSON:", JSON.stringify(data, null, 2));
                } else {
                    //console.log("Succeed device:params", JSON.stringify(params, null, 2));
                }
            });
        }
    }

    ///////////////////////////////////////////////// Check getLocation /////////////////////////////////////////
    async function getLocation(dataResponse) {
        var paramsUpdateLatLong = {
            TableName: "STREET-LIGHT",
            Key: {
                "IMEI": dataResponse.SN
            },
            ExpressionAttributeNames: {
                "#LAT": "LAT",
                "#LONG": "LONG",
                "#LAC": "LAC",
                "#CID": "CID"
            },
            ExpressionAttributeValues: {
                ":LAT": dataResponse.VALUE.LAT == 'not found!' ? '-' : dataResponse.VALUE.LAT,
                ":LONG": dataResponse.VALUE.LONG == 'not found!' ? '-' : dataResponse.VALUE.LONG,
                ":LAC": dataResponse.VALUE.LAC,
                ":CID": dataResponse.VALUE.CID
            },
            UpdateExpression: "SET #LAT = :LAT, #LONG = :LONG, #LAC = :LAC, #CID = :CID",
        };
        dynamo.update(paramsUpdateLatLong, function (err, data) {
            if (err) {
                //console.log("paramsUpdateCID ERROR == > CID = " + dataResponse.VALUE.CID);
            } else {
                //console.log("paramsUpdateCID Success == > CID = " + dataResponse.VALUE.CID);
            }
        });
    }
    ///////////////////////////////////////////////// Check getFWVersion ///////////////////////////////////////
    async function getFWVersion(dataResponse) {
        var paramsUpdateFWVersion = {
            TableName: "STREET-LIGHT",
            Key: {
                "IMEI": dataResponse.SN
            },
            UpdateExpression: "set #FWVersion=:FWVersion",
            ExpressionAttributeNames: {
                "#FWVersion": "FWVersion"
            },
            ExpressionAttributeValues: {
                ":FWVersion": (dataResponse.VALUE.FW == "" ? "-" : dataResponse.VALUE.FW)
            }
        };
        dynamo.update(paramsUpdateFWVersion, function (err, data) {
            if (err) {
                //console.log("<== paramsUpdateFWVersionl ERROR ==>");
            } else {
                //console.log("<== paramsUpdateFWVersionl Success ==>");
            }
        });

    }
    ///////////////////////////////////////////////// Update Laod Mode ///////////////////////////////////////
    async function updateLoadMode(dataResponse) {
        var paramsUpdateLoad = {
            TableName: "STREET-LIGHT",
            Key: {
                "IMEI": dataResponse.SN
            },
            UpdateExpression: "set #LOAD_MODE=:LOAD_MODE",
            ExpressionAttributeNames: {
                "#LOAD_MODE": "LOAD_MODE"
            },
            ExpressionAttributeValues: {
                ":LOAD_MODE": dataResponse.VALUE.LOADMODE
            }
        };
        dynamo.update(paramsUpdateLoad, function (err, data) {
            if (err) {
                //console.log("<== paramsUpdateLoad ERROR ==>");
            } else {
                //console.log("<== paramsUpdateLoad Success ==>");
            }
        });
    }
    ///////////////////////////////////////////////// Register Device //////////////////////////////////////
    async function registerDevice(dataResponse) {

        var paramsRegister = {
            TableName: "STREET-LIGHT",
            Key: {
                "IMEI": dataResponse.SN
            },
            Item: {
                "IMEI": dataResponse.SN,
                "PROJECT_NAME": projectName,
                "LAST_UPDATE": DATE_TIME,
                "TIMESTAMP": timeStampThai,
                "GROUP_NAME": dynamo.createSet(["ALL"]),
                "GROUP_CODE": dynamo.createSet([codeProjectName]),
                "LAST_COMMAND": dynamo.createSet(["0", "99"]),
                "LAST_TOKEN": "-",
                "LAST_STATUS": "1"
            },
            ExpressionAttributeNames: { "#PROJECT_NAME": "PROJECT_NAME" },
            ExpressionAttributeValues: { ":project_name": projectName },
            ConditionExpression: '#PROJECT_NAME <> :project_name OR attribute_not_exists(IMEI) OR attribute_not_exists(GROUP_NAME)'
        };

        dynamo.put(paramsRegister, function (err, data) {
            if (err) {
                //console.error("Unable to add paramsRegister. Error JSON:", JSON.stringify(err, null, 2));
                //console.log("6");
            } else {
                console.log("Added device: paramsRegister", JSON.stringify(data, null, 2));
                var docClient = new AWS.DynamoDB.DocumentClient();
                var paramsGroup = {
                    TableName: 'STREET-LIGHT-GROUP',
                    ExpressionAttributeNames: { "#PROJECT_NAME": "PROJECT_NAME", "#GROUP_CODE": "GROUP_CODE" },
                    ExpressionAttributeValues: { ":project_name": projectName, ":group_code": codeProjectName },
                    KeyConditionExpression: "#PROJECT_NAME = :project_name AND #GROUP_CODE = :group_code"

                };
                docClient.query(paramsGroup, async function (err, datas) {
                    if (err) {
                        console.log("Error", err);
                    }
                    else {
                        var countLed = parseInt(datas.Items[0].COUNT_LED) + 1;
                        //###########################################################################    FOR UPDATE DEVICE.

                        var paramsUpdateCountGroup = {
                            TableName: "STREET-LIGHT-GROUP",
                            Key: {
                                "PROJECT_NAME": projectName
                                , "GROUP_CODE": codeProjectName
                            },
                            UpdateExpression: "set COUNT_LED = :count_led",
                            ExpressionAttributeValues: { ":count_led": countLed }
                        };
                        dynamo.update(paramsUpdateCountGroup, function (err, data) {
                            if (err) {
                                //console.error("Unable to add paramsUpdate. Error JSON:", JSON.stringify(err, null, 2));
                                //console.log("7");
                            } else {
                                //console.log("UPDATE GROUP COUNT------------------>", JSON.stringify(countLed, null, 2));
                                //console.log("8");
                            }
                        });
                    }
                });


            }
        });
    }

};