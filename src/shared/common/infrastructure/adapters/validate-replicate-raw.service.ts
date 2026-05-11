import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
import { ReplicateValidateRawPort } from "../../application/use-cases/validate-raw-signed-replicate.port";

@Injectable()
export class ValidateReplicateRawService implements ReplicateValidateRawPort {
  validateRaw(rawBody: Buffer, headers: Record<string, unknown>, secret: string): boolean {
    const secretKey = secret.replace('whsec_', '');
    
    const id = this.getHeaderString(headers['webhook-id']);
    const timestamp = this.getHeaderString(headers['webhook-timestamp']);
    const signatures = this.getHeaderString(headers['webhook-signature']);

    if (!id || !timestamp || !signatures) return false;

    // 1. Validar ventana de tiempo (5 minutos)
    const tolerance = 300;
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - Number(timestamp)) > tolerance) return false;

    // 2. Calcular HMAC-SHA256
    const signedContent = `${id}.${timestamp}.${rawBody.toString('utf-8')}`;
    const secretBuffer = Buffer.from(secretKey, 'base64');
    
    const expectedSignature = crypto
      .createHmac('sha256', secretBuffer)
      .update(signedContent)
      .digest('base64');

    // 3. Comparar firmas (v1)
    return signatures.split(' ').some((sig) => {
      const [version, signature] = sig.split(',');
      if (version !== 'v1') return false;
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'base64'),
        Buffer.from(expectedSignature, 'base64')
      );
    });
  }
  private getHeaderString(value: unknown): string | null {
  
    if (Array.isArray(value)) {
      const first: unknown = value[0]
        if (typeof first === 'string') {
            return first; 
        }
        return null;
    }
    
    // 2. Si es un string directamente, lo retornamos
    if (typeof value === 'string') {
      return value;
    }

    // 3. En cualquier otro caso, devolvemos null
    return null;
  }
}