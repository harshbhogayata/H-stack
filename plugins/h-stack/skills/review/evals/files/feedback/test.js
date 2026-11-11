const a=require('assert');const {handler}=require('./server');let code;handler({url:'/health'},{writeHead:(c)=>{code=c},end:()=>{}});a.strictEqual(code,200);console.log('ok')
