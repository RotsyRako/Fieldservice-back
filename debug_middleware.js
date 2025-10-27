// Middleware de débogage temporaire
const debugMiddleware = (req, res, next) => {
  console.log('🔍 === DEBUG MIDDLEWARE ===');
  console.log('🔍 URL:', req.url);
  console.log('🔍 Method:', req.method);
  console.log('🔍 Headers:', req.headers);
  console.log('🔍 Body avant parsing:', req.body);
  console.log('🔍 Body après parsing:', JSON.stringify(req.body, null, 2));
  
  // Vérifier chaque champ individuellement
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      console.log(`🔍 Champ "${key}":`, typeof req.body[key], '=', req.body[key]);
    });
  }
  
  console.log('🔍 === FIN DEBUG ===');
  next();
};

module.exports = debugMiddleware;
