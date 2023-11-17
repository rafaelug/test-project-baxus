
import { webcrypto as crypto } from 'node:crypto';

export async function signProcess(message: string, id: string): Promise<string> {

    let enc = new TextEncoder();
    let encoded = enc.encode(message+id);

        let keys = await getKeys()
        let signature = await crypto.subtle.sign(
          {
            name: "ECDSA",
            hash: { name: "SHA-384" },
          },
          keys.privateKey,
          encoded,
        );
  
        
        let signer = Buffer.from(signature,).toString('base64')
        

    return signer;
}


// for real use cases is recommended to use a  key management system (KMS).
// This function should retrieve the keys from a KMS or MS, 
// however, for the sake of this test, I will generate the keys here to simulate they are retrived from KMS
async function getKeys(): Promise<crypto.CryptoKeyPair> {
 
  let keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    true,
    ["sign", "verify"],
  );

  return keyPair;
}