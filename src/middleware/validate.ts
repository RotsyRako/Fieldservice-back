import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { fail } from "../utils/base_response.utils";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    console.log("🔍 [VALIDATE] Début de la validation");
    console.log("🔍 [VALIDATE] Body reçu:", JSON.stringify(req.body, null, 2));
    console.log("🔍 [VALIDATE] Type de body:", typeof req.body);
    console.log("🔍 [VALIDATE] Clés du body:", Object.keys(req.body || {}));
    console.log("🔍 [VALIDATE] Schema utilisé:", schema);
    
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      console.error("❌ [VALIDATE] Erreurs de validation:", JSON.stringify(result.error.issues, null, 2));
      const msg = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join("; ");
      console.error("❌ [VALIDATE] Message d'erreur complet:", msg);
      console.error("❌ [VALIDATE] Détail des erreurs par champ:");
      result.error.issues.forEach((issue, index) => {
        console.error(`  ${index + 1}. Champ: ${issue.path.join('.')}, Message: ${issue.message}, Valeur reçue: ${JSON.stringify(issue.input)}`);
      });
      return res.status(400).json(fail(msg));
    }
    
    console.log("✅ [VALIDATE] Validation réussie - Données validées:", JSON.stringify(result.data, null, 2));
    req.body = result.data; // données validées
    console.log("✅ [VALIDATE] Passage au contrôleur");
    next();
  };
