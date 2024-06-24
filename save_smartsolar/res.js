import * as AWS from "aws-sdk";
//var AWS = require("aws-sdk");
// Set the region
var dynamo = new AWS.DynamoDB.DocumentClient();
AWS.config.region = "ap-southeast-1";
var projectName = "smartsolar";
var s3Client = new AWS.S3({ apiVersion: "2006-03-01" });
var SetTimeZone = 7;

exports.handler = function (event, context) {
  var dataResponse = event;
  var dateNew = new Date();
  dateNew.setHours(dateNew.getHours() + SetTimeZone);

  var DATE = dateNew.getFullYear() +
    "-" + ("0" + (dateNew.getMonth() + 1)).slice(-2) +
    "-" + ("0" + dateNew.getDate()).slice(-2);

  var DATE_TIME = dateNew.getFullYear() +
    "-" + ("0" + (dateNew.getMonth() + 1)).slice(-2) +
    "-" + ("0" + dateNew.getDate()).slice(-2) +
    " " + ("0" + dateNew.getHours()).slice(-2) +
    ":" + ("0" + dateNew.getMinutes()).slice(-2) +
    ":" + ("0" + dateNew.getSeconds()).slice(-2);

  var TIME = ("0" + dateNew.getHours()).slice(-2) +
    ":" + ("0" + dateNew.getMinutes()).slice(-2) +
    ":" + ("0" + dateNew.getSeconds()).slice(-2);

  var timeStampThai = Math.floor(new Date().getTime() / 1000);

  var dateTTL = new Date();
  dateTTL.setDate(dateTTL.getDate() + 5);
  var timeStampTTL = Math.floor(dateTTL / 1000);

  main();

  /////////////////////////////////////////////////////// main ////////////////////////////////////////////////////
  async function main() {
    try {
      //console.log(dataResponse);
      switch (
        dataResponse.TYPE +
        "_" +
        (dataResponse.MODE == undefined ? "" : dataResponse.MODE)
      ) {
        case "control_onoff":
          await AddDataLastTokenToDynamoDB(dataResponse);
          await AddDataLogCommandToS3(dataResponse);
          await SetDataCommand(dataResponse);
          break;
        case "schedule_":
          await setDataResponseFromDevice(dataResponse);
          await setDataControlFromDevice(dataResponse);
          break;  
        case "config_schedule":
          await setResponseCodeSchedule(dataResponse);
          await setResponseSettingSchedule(dataResponse);
          break;
        case "config_lighton":
          await setResponseSettingSchedule(dataResponse);
          break;
        case "getpower_all":
          await getLogData(dataResponse);
          await updateDevice(dataResponse);
          break;
        default:
      }
    } catch (ex) {
      console.log("Catch == >>> " + ex);
    }
  }

  //////////////////////////////////////////// Add Data StreetLight Log Command To S3 ////////////////////////////
  async function AddDataLogCommandToS3(dataResponse) {
    var dataLogsCommandList = {
      IMEI: dataResponse.SN,
    };

    var paramDatas = {
      Bucket: "les-street-light-" + projectName,
      ACL: "public-read",
      StorageClass: "STANDARD",
      Body: JSON.stringify(dataLogsCommandList),
      ContentType: "application/json",
      Key:
        projectName +"-data-logs-command/token=" + dataResponse.TOKEN + "/" + JSON.stringify(dataLogsCommandList),
    };
    await s3Client.upload(paramDatas, function (err, data) {
      if (err) {
        //console.log("Error creating the folder: ", err);
      } else {
        //console.log("Successfully created a folder on S3");
      }
    });
  }

  //////////////////////////////////////////// Add Data StreetLight TOKEN TO DynamoDB ////////////////////////////
  async function AddDataLastTokenToDynamoDB(dataResponse) {
    var paramsUpdateLatLong = {
      TableName: "STREET-LIGHT",
      Key: {
        IMEI: dataResponse.SN,
      },
      UpdateExpression: "set #RESPONSE_LAST_TOKEN=:RESPONSE_LAST_TOKEN",
      ExpressionAttributeNames: {
        "#RESPONSE_LAST_TOKEN": "RESPONSE_LAST_TOKEN",
      },
      ExpressionAttributeValues: {
        ":RESPONSE_LAST_TOKEN": dataResponse.TOKEN,
      },
    };
    dynamo.update(paramsUpdateLatLong, function (err, data) {
      if (err) {
        //console.log("err");
      } else {
        //console.log("Succ");
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

  ///////////////////////////////////////////////// Update Device ////////////////////////////////////////
  async function updateDevice(dataResponse) {
    var paramsUpdate = {
      TableName: "STREET-LIGHT",
      Key: {
        IMEI: dataResponse.SN,
      },
      UpdateExpression:
        "set #TIMESTAMP=:TIMESTAMP," +
        "LAST_UPDATE=:LAST_UPDATE," +
        "VSOLAR=:VSOLAR," +
        "ISOLAR=:ISOLAR," +
        "WSOLAR=:WSOLAR," +
        "VLOAD=:VLOAD," +
        "ILOAD=:ILOAD," +
        "WLOAD=:WLOAD," +
        "VBAT=:VBAT," +
        "IBAT=:IBAT," +
        "WBAT=:WBAT," +
        "LAST_VOLT=:LAST_VOLT," +
        "LAST_POWER=:LAST_POWER",

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
      ExpressionAttributeNames: { "#TIMESTAMP": "TIMESTAMP" },
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
  ///////////////////////////////////////////////// Set Data Command TO DynamoDB /////////////////////////////////
  async function SetDataCommand(dataResponse) {
    var paramTimestamp = {
      TableName: "STREET-LIGHT-COMMAND-LOG",
      ScanIndexForward: false,
      Limit: 1,
      KeyConditionExpression: "#IMEI = :imei and #TIMESTAMP >= :timestamp ",
      ExpressionAttributeNames: { "#IMEI": "IMEI", "#TIMESTAMP": "TIMESTAMP" },
      ExpressionAttributeValues: { ":imei": dataResponse.SN, ":timestamp": 0 },
    };
    // async function timestamp (paramTimestamp){

    dynamo.query(paramTimestamp, async function (errTimestamp, timestamp) {
      var timestampDescending = await timestamp.Items[0].TIMESTAMP;
      //console.log(timestamp.Items[0].TIMESTAMP)

      var paramsUpdate = {
        TableName: "STREET-LIGHT-COMMAND-LOG",
        Key: {
          IMEI: dataResponse.SN,
          TIMESTAMP: timestampDescending,
        },
        ConditionExpression: "#TIMESTAMP > :TIMESTAMP ",
        UpdateExpression:
          "set #TOKEN_RESPONSE=:TOKEN_RESPONSE, #TTL_FIELD_EXPIRE =:TTL_FIELD_EXPIRE ",
        ExpressionAttributeNames: {
          "#TOKEN_RESPONSE": "TOKEN_RESPONSE",
          "#TIMESTAMP": "TIMESTAMP",
          "#TTL_FIELD_EXPIRE": "TTL_FIELD_EXPIRE",
        },
        ExpressionAttributeValues: {
          ":TOKEN_RESPONSE": "T",
          ":TIMESTAMP": 0,
          ":TTL_FIELD_EXPIRE": timestampDescending + 432000,
        },
      };

      dynamo.update(paramsUpdate, async function (err, data) {
        if (err) {
          //console.error("Unable to add paramsUpdate. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          //console.log(paramsUpdate);
          //console.log("Added device: paramsUpdate", JSON.stringify(data, null, 2));
        }
      });
    });
  }

  ///////////////////////////////////////////////// Add Data StreetLight Log Config To S3 ////////////////////////////
  async function AddDataLogConfigToS3(dataResponse) {
    var dataLogsCommandList = {
      IMEI: dataResponse.SN,
    };

    var paramDatas = {
      Bucket: "les-street-light-" + projectName,
      ACL: "public-read",
      StorageClass: "STANDARD",
      Body: JSON.stringify(dataLogsCommandList),
      ContentType: "application/json",
      Key:
        projectName +
        "-data-logs-config/token=" +
        dataResponse.TOKEN +
        "/" +
        JSON.stringify(dataLogsCommandList),
    };
    await s3Client.upload(paramDatas, function (err, data) {
      if (err) {
        //console.log("Error creating the folder log Config : ", err);
      } else {
        //console.log("Successfully created a folder log Config on S3");
      }
    });
  }

  ///////////////////////////////////////////////// Response Control From Device ///////////////////////////
  async function setDataResponseFromDevice(dataResponse) {

    var params = {
      TableName: "STREET-LIGHT-SCHEDULE-LOG-SOLAR",
      Item: {
        TIMESTAMP: timeStampThai,
        IMSI: dataResponse.SN,
        DATETIME: DATE_TIME,
        STEP:dataResponse.VALUE.STEP,
        DIM:dataResponse.VALUE.DIM,
        TOKEN:dataResponse.TOKEN
        //TTL_FIELD_EXPIRE: timeStampTTL,
      },
    };

    dynamo.put(params, function (err, data) {
      if (err) {
        //console.error("Unable to add params. Error JSON:", JSON.stringify(data, null, 2));
      } else {
        //console.log("Succeed device:params", JSON.stringify(params, null, 2));
      }
    });
  }

  async function setDataControlFromDevice(dataResponse){

    var paramsUpdate = {
      TableName: "STREET-LIGHT",
      Key: {
        IMEI: dataResponse.SN,
      },
      UpdateExpression:
        "set #LAST_COMMAND =:LAST_COMMAND",

      ExpressionAttributeValues: {
        ":LAST_COMMAND": dynamo.createSet([dataResponse.VALUE.DIM == '0' ? '0' : '1' , dataResponse.VALUE.DIM == '0' ? '1' :  dataResponse.VALUE.DIM ])
      },
      ExpressionAttributeNames: { "#LAST_COMMAND": "LAST_COMMAND" },
    };

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
  ////////////////////////////////////////////// Response Config schedule ////////////////////////////////////
  async function setResponseCodeSchedule(dataResponse){
    var paramsUpdate = {
      TableName: "STREET-LIGHT",
      Key: {
        IMEI: dataResponse.SN,
      },
      UpdateExpression:
        "set #SET_SENSE =:SET_SENSE",

      ExpressionAttributeValues: {
        ":SET_SENSE": dataResponse.STATUS == '1' ? true : false
      },
      ExpressionAttributeNames: { "#SET_SENSE": "SET_SENSE" },
    };

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
  ////////////////////////////////////////////// Response Config schedule Log ////////////////////////////////////
  async function setResponseSettingSchedule(dataResponse){
    var paramsUpdate = {
      TableName: "RESPONSE-SCHEDULE-" + projectName.toUpperCase(),
      Key: {
        CODE_NAME : dataResponse.TOKEN,
        IMSI: dataResponse.SN,
      },
      UpdateExpression:
        "set #TIME_RESPONSE =:TIME_RESPONSE",

      ExpressionAttributeValues: {
        ":TIME_RESPONSE": dataResponse.STATUS == 1 ? timeStampThai : 0
      },
      ExpressionAttributeNames: { "#TIME_RESPONSE": "TIME_RESPONSE" },
    };

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

};
