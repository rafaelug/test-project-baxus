
import express from 'express';
import validator from 'validator';
import cors from 'cors';
import yargs from 'yargs/yargs';

import { Client } from '@temporalio/client';
import { signer } from './workflows';
import { signStateQuery, signatureStateQuery } from './workflows';


async function main({ port = 8888 }: any) {
  const app = express();
  app.use(cors({ allowedHeaders: ['x-namespace', 'content-type'] }));
  app.use(express.json());

  app.post('/sign', async (req, res) => {

    try {

      let { msg, id } = req.body;

      //in case there is any additional requirement, just change 
      //the type of validator to one that fits the req.
      msg = validator.stripLow(msg)
      let cleanMsg = msg != null ? msg : null
      let cleanID = validator.isUUID(id) == true ? id : null 
      let safe = cleanMsg != null && cleanID != null ? true : false

      console.log(cleanID, validator.isUUID(id) == true, safe)

      if(safe){
        let client = new Client()

        let _handle = await  client.workflow.start(signer, {
          args: [cleanMsg, cleanID],
          taskQueue: 'API',
          workflowId: "workflow-"+cleanID,
         });

        res.send('done')

      }else{
        res.status(405).send({ message: 'ups! there is an input format error' });

      }
      
      
    } catch (err: any) {
      console.error('Error in /sign', err.name);
      res.status(405).send({ message: 'ups! there is an input format error' + err.name});
      
    }
  });

  app.get('/check', async (req, res) => {

    try {
      const { id } = req.query;
      let cleanID = validator.isUUID(''+id) == true ? id : null 
      let safe = cleanID != null ? true : false

      if(safe){
        let client = new Client();

        
        try {
          let handleS = client.workflow.getHandle('workflow-'+cleanID);
          let status = await handleS.query(signStateQuery);
         
          let handleQ = client.workflow.getHandle('workflow-'+cleanID);
          let signature = await handleQ.query(signatureStateQuery);

          res.send({status, signature})

        } catch (err: any) {
          res.status(405).send({ message: 'Oh no!! '+cleanID+'  is lost ' });
        }
        
  
        

      }else{
        res.status(405).send({ message: 'Ups! there is an input format error' });

      }

    
    } catch (err) {
      console.error('Error in /check', err);
      res.status(500).end('Internal server error');
    }
  });

  await new Promise<void>((resolve, reject) => {
    app.listen(port, resolve);
    app.on('error', reject);
  });


  console.log(`Server listening on port ${port}`);
}

const argv = yargs(process.argv.slice(2)).argv;

main(argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
