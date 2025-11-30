import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Coordonnées de base de Tana (Antananarivo)
const TANA_LAT = -18.903260;
const TANA_LONG = 47.533768;

// Fonction pour générer des coordonnées aléatoires autour de Tana
function generateRandomCoordinates(baseLat: number, baseLong: number, radiusKm: number = 10) {
  // Conversion du rayon en degrés (approximatif)
  const radiusInDegrees = radiusKm / 111; // 1 degré ≈ 111 km
  
  // Génération de coordonnées aléatoires dans un cercle
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInDegrees;
  
  const lat = baseLat + (distance * Math.cos(angle));
  const long = baseLong + (distance * Math.sin(angle));
  
  return { lat, long };
}

// Données des interventions à créer
const interventionsData = [
  {
    titre: "Maintenance système de climatisation - Ambohijatovo",
    description: "Intervention de maintenance préventive sur le système de climatisation du bâtiment principal. Vérification des filtres, nettoyage des unités extérieures et contrôle des niveaux de réfrigérant.",
    customer: "Entreprise TechMad",
    priority: "Haute",
    status: 0,
    distance: 2.5,
  },
  {
    titre: "Réparation panne électrique - Analakely",
    description: "Dépannage urgent suite à une panne électrique dans les bureaux. Remplacement de disjoncteurs défectueux et vérification de l'installation électrique complète.",
    customer: "Bureau Commercial Analakely",
    priority: "Urgente",
    status: 1,
    distance: 3.8,
  },
  {
    titre: "Installation système de sécurité - Isoraka",
    description: "Installation complète d'un système de sécurité avec caméras de surveillance, alarmes et contrôle d'accès. Configuration et tests de tous les équipements.",
    customer: "Résidence Isoraka",
    priority: "Moyenne",
    status: 0,
    distance: 1.2,
  },
  {
    titre: "Maintenance ascenseur - Ankadifotsy",
    description: "Maintenance trimestrielle de l'ascenseur. Vérification des câbles, lubrification des mécanismes, test de sécurité et mise à jour du carnet d'entretien.",
    customer: "Immeuble Ankadifotsy",
    priority: "Haute",
    status: 2,
    distance: 5.3,
  },
  {
    titre: "Réparation réseau informatique - Tsaralalana",
    description: "Résolution de problèmes de connectivité réseau. Remplacement de switchs défectueux, reconfiguration des routeurs et optimisation de la bande passante.",
    customer: "Cabinet d'avocats Tsaralalana",
    priority: "Urgente",
    status: 1,
    distance: 2.1,
  },
  {
    titre: "Installation panneaux solaires - Ambohimangakely",
    description: "Installation d'un système photovoltaïque pour l'autoconsommation. Pose des panneaux, installation de l'onduleur et connexion au réseau électrique existant.",
    customer: "Villa Ambohimangakely",
    priority: "Moyenne",
    status: 0,
    distance: 7.5,
  },
  {
    titre: "Maintenance générateur - Ivandry",
    description: "Maintenance préventive du groupe électrogène. Changement d'huile, remplacement des filtres, test de démarrage et vérification du système de refroidissement.",
    customer: "Centre Commercial Ivandry",
    priority: "Haute",
    status: 0,
    distance: 8.2,
  },
  {
    titre: "Réparation système d'arrosage - Ankadikely",
    description: "Réparation du système d'arrosage automatique. Remplacement de vannes défectueuses, réparation des fuites et reprogrammation des cycles d'arrosage.",
    customer: "Jardin Public Ankadikely",
    priority: "Basse",
    status: 1,
    distance: 4.7,
  },
  {
    titre: "Installation système domotique - Ambatomena",
    description: "Installation d'un système domotique complet. Contrôle de l'éclairage, chauffage, volets et sécurité via application mobile. Configuration et formation des utilisateurs.",
    customer: "Résidence Ambatomena",
    priority: "Moyenne",
    status: 0,
    distance: 6.9,
  },
  {
    titre: "Maintenance pompe à eau - Anosy",
    description: "Maintenance de la pompe à eau principale. Vérification de la pression, nettoyage des filtres, contrôle électrique et test de performance complet.",
    customer: "Complexe Résidentiel Anosy",
    priority: "Haute",
    status: 2,
    distance: 3.4,
  },
];

async function main() {
  console.log("🧹 Nettoyage complet de la base de données...");

  // Suppression dans l'ordre pour respecter les contraintes de clés étrangères
  await prisma.signature.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.image.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.materiel.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Base de données nettoyée avec succès");

  console.log("👤 Création de l'utilisateur...");

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Création de l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: "rotsyrako@gmail.com",
      password: hashedPassword,
      name: "Rotsy Rako",
      token: null,
    },
  });

  console.log(`✅ Utilisateur créé : ${user.email} (ID: ${user.id})`);

  console.log("🔧 Création des 10 interventions...");

  // Dates pour les interventions (réparties sur les prochains mois)
  const today = new Date();
  const interventions = [];

  for (let i = 0; i < interventionsData.length; i++) {
    const data = interventionsData[i];
    const { lat, long } = generateRandomCoordinates(TANA_LAT, TANA_LONG, 10);
    
    // Génération de dates (début aujourd'hui + i jours, fin + i+1 jours)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + i);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const intervention = await prisma.intervention.create({
      data: {
        titre: data.titre,
        description: data.description,
        customer: data.customer,
        priority: data.priority,
        status: data.status,
        lat: lat,
        long: long,
        distance: data.distance,
        dateStart: startDate.toISOString().split('T')[0],
        dateEnd: endDate.toISOString().split('T')[0],
        userId: user.id,
      },
    });

    interventions.push(intervention);
    console.log(`  ✅ Intervention ${i + 1}/10 créée : ${intervention.titre}`);
  }

  console.log(`\n🎉 Seed terminé avec succès !`);
  console.log(`   - 1 utilisateur créé`);
  console.log(`   - ${interventions.length} interventions créées`);
  console.log(`   - Localisation : Tana et alentours (${TANA_LAT}, ${TANA_LONG})`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

