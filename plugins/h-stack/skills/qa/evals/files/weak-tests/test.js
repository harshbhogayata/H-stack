const a=require('assert');const {clamp}=require('./clamp');a.strictEqual(clamp(5,0,10),5);a.strictEqual(clamp(-1,0,10),0);console.log('2 passed')
