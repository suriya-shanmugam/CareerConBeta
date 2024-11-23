obj = {
    name : "suriya",
    export : {}
}

function callme(){

    console.log("called");

}

obj.export.callme = callme;
console.log(obj);

obj.export =  {callme}

console.log(obj);

/*let promise = new Promise( (resolve,reject) => {
    
    let result = true;
    setTimeout(() => {

        if (result){
            const res = {code:200,result:"success"}
            resolve(res)
        }else{
            reject("Failure")
        }
    
    },3000);
});

promise.then(result => {
    console.log(result)
}).catch((error)=> {
    console.log(error)
})


console.log("Already vandhutten Inga") */