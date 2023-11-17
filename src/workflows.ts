
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';
import * as wf from '@temporalio/workflow';

type SignState = 'SIGNING' | 'COMPLETED' | 'ERROR';
export const signingMessage = wf.defineSignal('signingMessage');
export const signatureSignal = wf.defineSignal('signature');
export const signStateQuery = wf.defineQuery<SignState>('signState');
export const signatureStateQuery = wf.defineQuery<string>('signatureState');


const {
  signProcess,
} = proxyActivities<typeof activities>({
  retry: {
    initialInterval: '50 milliseconds',
    maximumAttempts: 2,
  },
  startToCloseTimeout: '30 seconds',
});


export async function signer(message: string, id: string): Promise<string> {

  let signState: SignState = 'SIGNING';
  let signature: string = '-'
  wf.setHandler(signingMessage, () => void (signState = 'SIGNING'));
  wf.setHandler(signStateQuery, () => signState);

  wf.setHandler(signatureSignal, () => void (signature = '-'));
  wf.setHandler(signatureStateQuery, () => signature)

  try {
    signature = await signProcess(message, id)
    
  } catch (error) {
    signState = 'ERROR'
  }
  
  signState = 'COMPLETED'

  return signature;
}


