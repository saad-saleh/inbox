const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
// const web3 = new Web3(ganache.provider());


//Fix
const provider = ganache.provider();
const web3 = new Web3(provider);

// how?
const {interface,bytecode} = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';

beforeEach(async ()=>{
    // get a list of all accounts
    // we used then because the function is async
    // Q about promises

    // web3.eth.getAccounts().then(fetchedAccounts => {console.log(fetchedAccounts);});
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode,arguments:[INITIAL_STRING]})
        .send({from:accounts[0],gas:'1000000'});
    //use one of accounts to deploy the contract

    //Fix
    inbox.setProvider(provider);
});



describe('Inbox',()=> {
    it('deploys a contract',()=>{
        assert.ok(inbox.options.address);
    });

    it('has a default message',async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message,INITIAL_STRING);
    });

    it('can change a message',async ()=>{
        const newMessage = 'New Message';
        
        //create a transaction
        await inbox.methods.setMessage(newMessage)
            .send({from:accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message,newMessage);
    });
});













/*
class Car{

    park(){
        return 'stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;

beforeEach(()=>{
    console.log('Declare Car Variable');
    car = new Car();
});

describe('Car',() =>{

    it('can park',()=>{
        assert.equal(car.park(),'stopped');
    });

    it('can drive',()=>{
        assert.equal(car.drive(),'vroom');
    });

});

*/