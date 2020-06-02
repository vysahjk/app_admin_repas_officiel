import initialState from './initialState.json'

const state_current = JSON.stringify(initialState)

export const reducers = (state: any = JSON.parse(state_current), action: any) => {

  switch(action.type){  
   
    case ("SET_AUTHENTICATED"):
      return { ...state, authenticated: action.payload }
    
    case ("SET_MEMBRE"):
      return { ...state, membre: action.payload }

    case ("SET_RESTAURATEUR"):
      return { ...state, restos: action.payload }

    case ("SET_CATEGORIES_CURRENT"):
      return { ...state, categoriesCurrents : action.payload }

    case ("SET_CATEGORIE"):
      return { ...state, categorie: action.payload }

    case ("ADD_CATEGORIE"):
      return { ...state, categoriesCurrents: action.payload }

    case ("SET_PLATS_CURRENTS"):
      return { ...state, platsCurrents: action.payload}

    case ("SET_PLAT"):
      return { ...state, plat: action.payload }
    
    case ("SET_RESTAURANT_CURRENT"):
      return { ...state, restaurantCurrent: action.payload}

    case ("SET_RESTAURANT_MODIFIER"):
      return { ...state, restaurantModifier: action.payload }

    case ("SET_MODIFICABLE"):
      return { ...state, modificable: action.payload }

    case ("SET_CSV_DATA"):
      return { ...state, csv: action.payload }

    case ("SET_CREATION"):
      return { ...state, creation: action.payload }

    case ("SET_COMMANDES_PASSE"):
      return { ...state, commandes_pasee: action.payload }

    case ("SET_COMMANDES_COURS"):
      return { ...state, commandes_cours: action.payload }

    case ("SET_REVENUS"):
      return { ...state, frais_total: action.payload }

    case ("SET_MEMBRES"):
      return { ...state, membres: action.payload }

    case ("SET_MEMBRE_ID_A_MODIFIER"):
      return { ...state, membre_id_a_modifier: action.payload }

    case ("SET_MEMBRE_A_MODIFIER"):
      return { ...state, membre_a_modifier: action.payload }

    case ("SET_COMMANDES_PASSE_MEMBRE"):
      return { ...state, commandes_pasee_membre: action.payload }

    case ("SET_COMMANDES_COURS_MEMBRE"):
      return { ...state, commandes_cours_membre: action.payload }

    case ("SET_CONSULTER"):
      return { ...state, consulter: action.payload }
    
      default:
      return state
  }
}


