
/* A batch loading function accepts an array of keys and returns a promise 
which resolves to an array of values 
Tick is an iteration of event loop 

Data loaders will coalesce / merge all individual loads which occurs 
within a single tick of an event loop and then call the batch loading 
function 
 */

const DataLoader = require ('dataloader');

const batchUsers = async (ids) =>{
    console.log ('Batchuser Called : ', ids);
    return ids;
}

const batchUserLoaders = new DataLoader (keys => batchUsers (keys));

batchUserLoaders.load(1);
batchUserLoaders.load(2);
batchUserLoaders.load(3);

//Force next tick
setTimeout (() => {
    batchUserLoaders.load(4);
    batchUserLoaders.load(5);
    batchUserLoaders.load(6);
}, 100)

//Force next tick
setTimeout (() => {
    batchUserLoaders.load(7);
    batchUserLoaders.load(8);
    batchUserLoaders.load(9);
}, 200)