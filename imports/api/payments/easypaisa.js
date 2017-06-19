let env = process.env;
import soap from 'soap';
import { HTTP } from 'meteor/http'

// var config = {
//     easipaisa: {
//         storeId:5820,
//         Hash_key: 'SW7Z00D2XGFZZSG8'
//         url:'https://easypay.easypaisa.com.pk/easypay-service/PartnerBusinessService/META-INF/wsdl/partner/transaction/PartnerBusinessService.wsdl',
//         mode:env != 'production' ? 'TEST' : 'PRODUCTION'
//     }
// };

//this one is test url for direct merchant transaction
let testURL = 'https://easypay.easypaisa.com.pk/easypay-service/PartnerBusinessService/META-INF/wsdl/partner/transaction/PartnerBusinessService.wsdl';

//here is minimal merchant test config obj
let testConfig = {
    Username: 'pgsystems',
    password: '9b01234324vxddc0b',
    channel: 'Internet',
    orderId: '000000001',
    storeId: '5820',
    transactionAmoun: '1000.00',
    transctionType: 'OCT',
    msisdn: '034632401722',
    mobileAccountNo: '034632401722',
    emailAddress: 'abc@test.com',
};

//and the initial data to check the server different responses with HTTP call
let initialData = {
    storeId: 5820,
    amount: '10',
    postBackURL: 'http://localhost:3000/',
    mobileNum: '03325241789'
};

//generalize http request with parameter diff
function maketestreqest(form){
    // HTTP.call("POST", "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf", {
    HTTP.call("POST", "https://easypay.easypaisa.com.pk/easypay/Index.jsf", {
                    data: initialData
               },
               function (error, result) {
                   if (!error) {
                       console.log(result);
                       return result
                   }
                   console.log(error);
                   return error
               })
}

//initial request initialize
function makeInitialRequest(fname){
    soap.createClient(testURL, {
        ignoredNamespaces: { namespaces: [], override: true }
        //ignoreBaseNameSpaces : true
    }, function(err, client) {
        if(err){
            console.log('error occured', err);
            return cb(err);
        }

        client.addSoapHeader(testConfig);
        console.log('testConfig', testConfig);
        console.log("client.soapHeaders", client.soapHeaders);

        client[fname](args, function(err, result, raw, soapHeader) {
            if(err){
                console.log('ERROR');
                console.log("err.body", err.body);
            }else{
                console.log("result", fname, result);
                console.log("raw", fname, raw);
                console.log("soapHeader", fname, soapHeader)
            }
        });

    });
}

//TODO:complete dynamic request based on dynamic arguments.
export const easyPaisa = {
    maketestreqest: maketestreqest
};
