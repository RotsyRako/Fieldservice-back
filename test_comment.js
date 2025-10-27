const axios = require('axios');

async function testCommentCreation() {
  try {
    console.log('🔍 Test de création de commentaire...');
    
    // D'abord, obtenons un token
    console.log('🔍 Connexion...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Token obtenu:', loginResponse.data.data.token);
    
    // Testons la création de commentaire
    console.log('🔍 Création du commentaire...');
    const commentData = {
      message: "This is a comment",
      date: "25/10/2025",
      idIntervention: "b029d8bf-b0ff-45fa-a8b5-3f898e711b5b"
    };
    
    console.log('📝 Données envoyées:', JSON.stringify(commentData, null, 2));
    
    const response = await axios.post('http://localhost:3000/api/comments', commentData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginResponse.data.data.token}`
      }
    });
    
    console.log('✅ Succès:', response.data);
    
  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testCommentCreation();
