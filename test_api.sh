#!/bin/bash

# Script de test automatisé pour l'API Rotsy Backend
# Ce script teste tous les endpoints principaux

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

echo "🚀 Test de l'API Rotsy Backend"
echo "================================"

# Variables pour stocker les IDs
USER_ID=""
AUTH_TOKEN=""
INTERVENTION_ID=""
MATERIEL_ID=""
TIMESHEET_ID=""

# Fonction pour afficher les résultats
print_result() {
    local test_name="$1"
    local status_code="$2"
    local response="$3"
    
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 201 ]; then
        echo "✅ $test_name - Code: $status_code"
    else
        echo "❌ $test_name - Code: $status_code"
        echo "   Response: $response"
    fi
}

# 1. Test Health Check
echo ""
echo "1. Test Health Check"
response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$BASE_URL/health")
status_code="${response: -3}"
print_result "Health Check" "$status_code" "$(cat /tmp/health_response.json)"

# 2. Création d'un utilisateur
echo ""
echo "2. Création d'un utilisateur"
response=$(curl -s -w "%{http_code}" -o /tmp/user_response.json -X POST "$API_URL/users" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User API",
        "email": "testapi@example.com",
        "password": "password123"
    }')
status_code="${response: -3}"
print_result "Création utilisateur" "$status_code" "$(cat /tmp/user_response.json)"

# Extraire l'ID utilisateur et le token
if [ "$status_code" -eq 201 ]; then
    USER_ID=$(cat /tmp/user_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    AUTH_TOKEN=$(cat /tmp/user_response.json | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   User ID: $USER_ID"
    echo "   Token: ${AUTH_TOKEN:0:20}..."
fi

# 3. Login
echo ""
echo "3. Test Login"
response=$(curl -s -w "%{http_code}" -o /tmp/login_response.json -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "testapi@example.com",
        "password": "password123"
    }')
status_code="${response: -3}"
print_result "Login" "$status_code" "$(cat /tmp/login_response.json)"

# 4. Création d'une intervention
echo ""
echo "4. Création d'une intervention"
response=$(curl -s -w "%{http_code}" -o /tmp/intervention_response.json -X POST "$API_URL/interventions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d "{
        \"titre\": \"Test Intervention API\",
        \"dateStart\": \"25/10/2025\",
        \"dateEnd\": \"26/10/2025\",
        \"status\": 1,
        \"priority\": \"high\",
        \"customer\": \"Test Customer\",
        \"long\": 45.123,
        \"lat\": 2.456,
        \"distance\": 10.5,
        \"description\": \"Test intervention description\",
        \"userId\": \"$USER_ID\"
    }")
status_code="${response: -3}"
print_result "Création intervention" "$status_code" "$(cat /tmp/intervention_response.json)"

# Extraire l'ID intervention
if [ "$status_code" -eq 201 ]; then
    INTERVENTION_ID=$(cat /tmp/intervention_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   Intervention ID: $INTERVENTION_ID"
fi

# 5. Création d'un matériel
echo ""
echo "5. Création d'un matériel"
response=$(curl -s -w "%{http_code}" -o /tmp/materiel_response.json -X POST "$API_URL/materiels" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d "{
        \"name\": \"Vis M6x20 Test\",
        \"quantity\": 50,
        \"idIntervention\": \"$INTERVENTION_ID\"
    }")
status_code="${response: -3}"
print_result "Création matériel" "$status_code" "$(cat /tmp/materiel_response.json)"

# Extraire l'ID matériel
if [ "$status_code" -eq 201 ]; then
    MATERIEL_ID=$(cat /tmp/materiel_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   Materiel ID: $MATERIEL_ID"
fi

# 6. Création d'un timesheet
echo ""
echo "6. Création d'un timesheet"
response=$(curl -s -w "%{http_code}" -o /tmp/timesheet_response.json -X POST "$API_URL/timesheets" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $AUTH_TOKEN" \
    -d "{
        \"description\": \"Test Timesheet API\",
        \"timeAllocated\": 2.5,
        \"date\": \"25/10/2025\",
        \"idIntervention\": \"$INTERVENTION_ID\"
    }")
status_code="${response: -3}"
print_result "Création timesheet" "$status_code" "$(cat /tmp/timesheet_response.json)"

# Extraire l'ID timesheet
if [ "$status_code" -eq 201 ]; then
    TIMESHEET_ID=$(cat /tmp/timesheet_response.json | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   Timesheet ID: $TIMESHEET_ID"
fi

# 7. Tests de récupération
echo ""
echo "7. Tests de récupération"

# Récupérer tous les utilisateurs
response=$(curl -s -w "%{http_code}" -o /tmp/get_users.json -X GET "$API_URL/users" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Get All Users" "$status_code" ""

# Récupérer toutes les interventions
response=$(curl -s -w "%{http_code}" -o /tmp/get_interventions.json -X GET "$API_URL/interventions" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Get All Interventions" "$status_code" ""

# Récupérer tous les matériels
response=$(curl -s -w "%{http_code}" -o /tmp/get_materiels.json -X GET "$API_URL/materiels" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Get All Materiels" "$status_code" ""

# Récupérer tous les timesheets
response=$(curl -s -w "%{http_code}" -o /tmp/get_timesheets.json -X GET "$API_URL/timesheets" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Get All Timesheets" "$status_code" ""

# 8. Tests de comptage
echo ""
echo "8. Tests de comptage"

# Compter les utilisateurs
response=$(curl -s -w "%{http_code}" -o /tmp/count_users.json -X GET "$API_URL/users/count" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Count Users" "$status_code" ""

# Compter les interventions
response=$(curl -s -w "%{http_code}" -o /tmp/count_interventions.json -X GET "$API_URL/interventions/count" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Count Interventions" "$status_code" ""

# Compter les matériels
response=$(curl -s -w "%{http_code}" -o /tmp/count_materiels.json -X GET "$API_URL/materiels/count" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Count Materiels" "$status_code" ""

# Compter les timesheets
response=$(curl -s -w "%{http_code}" -o /tmp/count_timesheets.json -X GET "$API_URL/timesheets/count" \
    -H "Authorization: Bearer $AUTH_TOKEN")
status_code="${response: -3}"
print_result "Count Timesheets" "$status_code" ""

# 9. Tests de mise à jour
echo ""
echo "9. Tests de mise à jour"

# Mettre à jour un timesheet
if [ -n "$TIMESHEET_ID" ]; then
    response=$(curl -s -w "%{http_code}" -o /tmp/update_timesheet.json -X PUT "$API_URL/timesheets/$TIMESHEET_ID" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -d '{
            "description": "Test Timesheet API - Updated",
            "timeAllocated": 3.0
        }')
    status_code="${response: -3}"
    print_result "Update Timesheet" "$status_code" ""
fi

# 10. Tests de suppression
echo ""
echo "10. Tests de suppression"

# Supprimer le timesheet
if [ -n "$TIMESHEET_ID" ]; then
    response=$(curl -s -w "%{http_code}" -o /tmp/delete_timesheet.json -X DELETE "$API_URL/timesheets/$TIMESHEET_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    status_code="${response: -3}"
    print_result "Delete Timesheet" "$status_code" ""
fi

# Supprimer le matériel
if [ -n "$MATERIEL_ID" ]; then
    response=$(curl -s -w "%{http_code}" -o /tmp/delete_materiel.json -X DELETE "$API_URL/materiels/$MATERIEL_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    status_code="${response: -3}"
    print_result "Delete Materiel" "$status_code" ""
fi

# Supprimer l'intervention
if [ -n "$INTERVENTION_ID" ]; then
    response=$(curl -s -w "%{http_code}" -o /tmp/delete_intervention.json -X DELETE "$API_URL/interventions/$INTERVENTION_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    status_code="${response: -3}"
    print_result "Delete Intervention" "$status_code" ""
fi

# Supprimer l'utilisateur
if [ -n "$USER_ID" ]; then
    response=$(curl -s -w "%{http_code}" -o /tmp/delete_user.json -X DELETE "$API_URL/users/$USER_ID" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    status_code="${response: -3}"
    print_result "Delete User" "$status_code" ""
fi

echo ""
echo "🎉 Tests terminés !"
echo "==================="

# Nettoyer les fichiers temporaires
rm -f /tmp/*_response.json /tmp/*_users.json /tmp/*_interventions.json /tmp/*_materiels.json /tmp/*_timesheets.json /tmp/*_count*.json /tmp/update_*.json /tmp/delete_*.json
