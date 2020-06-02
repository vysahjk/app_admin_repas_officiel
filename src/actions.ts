import fetch from "isomorphic-fetch"
// import restaurant from "./Restaurants/restaurant";
const { Parser } = require('json2csv')
var Jimp = require('jimp');
/**
 * 
 * @param membre 
 * @param password 
 */
export const setCredentials = (membre: string, password: string) => (dispatch : any, getState : any) => {

  const payload = {
    name: membre,
    password
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/connexion`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {

      switch (data.code) {

        case (403):
          window.location.reload()
         
          break

        case (404):
          window.location.reload()
          break

        default:
          sessionStorage.setItem('token', data.message)
          dispatch({
            type: "SET_AUTHENTICATED",
            payload: true
          })
          dispatch({
            type: "SET_MEMBRE",
            payload: data.membre
          })
          window.location.href = '/dashboard'
      }

    })

}

const sendMail = (username : string, email : string) => {
  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/authentication/verification/sendmail/${username}/${email}`)
    .then(res => res.json())
    .then(data => {
      window.location.href = "/"
    })
}


export const inscription = (user : any) => (dispatch : any, getState : any ) => {

  let payload = {
    name: user.username,
    password: user.password,
    telephone: user.phone,
    email: user.email,
    active: true,
    type: "administrateur"
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/authentication/create/client`, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => {
      
      sendMail(payload.name, payload.email)
    })
}


export const resizeImage = (image: any) => async (dispatch: any, getState: any) => {

  const test = await Jimp.read(image)  
  const image_resize = await test.resize(300, 147).getBase64Async("image/png")

  
  return image_resize.split(",")[1]
 

}

export const creationRestaurant = (resto : any) => (dispatch: any, getState: any) => {
  

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/creation/resto`, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resto)
  })
    .then(res => res.json())
    .then(data => {
      
      dispatch({
        type : 'SET_CREATION',
        payload : true
      })

    })
}


/**
 * On vide les plats 
 * @param restaurantCurrent 
 */
export const setRestaurantCurrent = (restaurantCurrent: string) => (dispatch : any, getState : any) => {
  
  dispatch({
    type: "SET_RESTAURANT_CURRENT",
    payload: restaurantCurrent
  })

  dispatch({
    type: 'SET_PLATS_CURRENTS',
    payload: []
  })
}

/**
 * 
 */
export const getRestos = () => (dispatch: any, getState: any) => {

  let restaurateur = getState().app.membre
  let datos: any[] = []

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/all/resto`,
    {
      method: 'GET',
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        restaurateur: restaurateur,
        "Content-Type": "application/json"
      }
    }
  )
    .then( res => res.json())
    .then( data => {

      dispatch({
        type: 'SET_RESTAURATEUR',
        payload: data.restos
      })

      data.restos.forEach((resto: any, key: number) => {
        datos.push({
          nom: resto.name,
          food: resto.food,
          quartier: resto.quartier,
          categories: resto.menu.length,
          plats: dispatch(setQuantitePlats(resto.menu)),
          ratio_plat_cat: Math.round(dispatch(setQuantitePlats(resto.menu)) / (resto.menu.length === 0 ? 1 : resto.menu.length) * 100) / 100,
          total_commandes: resto.commandes.length,
          ventes: dispatch(setSold(resto.commandes)),
        })

      })
  
      let csv = getJsontoCsv(datos)
      
      dispatch({
        type: 'SET_CSV_DATA',
        payload: csv
      })

      dispatch({
        type: 'SET_CREATION',
        payload: false
      })
    
    })


  

}

/**
 * On obtien all categories quand on selection un restaurant
 * @param restaurant 
 */
export const getCategoriesByRestaurant = (restaurant : string) => (dispatch: any, getState : any) => {

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/all/categories`,
    {
      method: 'GET',
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        restaurant: restaurant,
        restaurateur: getState().app.membre,
        categorie: getState().app.categorie,
        "Content-Type": "application/json"
      }
    }
  )
    .then( res => res.json())
    .then( data => {
      dispatch({
        type: 'SET_CATEGORIES_CURRENT',
        payload: data
      })

    })


}


/**
 * 
 * @param restaurant 
 * @param dispatch 
 * @param getState 
 */
const updateCategories = (dispatch: any, getState: any) => {
  
  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/all/categories`,
    {
      method: 'GET',
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        restaurant: getState().app.restaurantCurrent,
        restaurateur: getState().app.membre,
        "Content-Type": "application/json"
      }
    }
  )
    .then(res => res.json())
    .then(data => {

      dispatch({
        type: 'SET_CATEGORIES_CURRENT',
        payload: data
      })
    })



  
}

/**
 * 
 * @param restaurant 
 * @param categorie 
 */
export const setCategorieByRestaurant = (categorie: string) => (dispatch: any, getState: any) => {

  let payload = {
    categorie: categorie,
    restaurateur: getState().app.membre,
    restaurant: getState().app.restaurantCurrent
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/creation/categorie`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then( res => res.json())
    .then( data => {

      updateCategories(dispatch, getState)

    })



  

}


/**
 * 
 * @param categorie 
 */
export const deleteCategorie = (categorie : string) => async (dispatch : any , getState : any) => {

  let payload = {
    restaurateur: getState().app.membre,
    restaurant: getState().app.restaurantCurrent,
    categorie: categorie
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/delete/categorie`, 
  {
    method : 'DELETE',
    mode: 'cors',
    headers: {
      Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      updateCategories(dispatch, getState)
    })
}


/**
 * 
 * @param categorie 
 * @param dispatch 
 * @param getState 
 */
const updatePlats = (categorie: string, dispatch: any, getState: any) => {

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/all/categories`,
    {
      method: 'GET',
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        restaurant: getState().app.restaurantCurrent,
        restaurateur: getState().app.membre,
        "Content-Type": "application/json"
      }
    }

  )
    .then(res => res.json())
    .then(data => {

      
      data.forEach((item: any, index: number) => {
        if (item.categorie === categorie) {
          dispatch({
            type: 'SET_PLATS_CURRENTS',
            payload: item.plats
          })
        }
      });
    })

}

/**
 * 
 * @param plats 
 * @param categorie 
 */
export const setPlats = (plats: Array<any>, categorie: string) => (dispatch: any, getState: any) => {
  
  dispatch({
    type: 'SET_CATEGORIE',
    payload : categorie
  })
  
  updatePlats(categorie, dispatch, getState)

}

/**
 * 
 * @param plat 
 * @param categorie 
 */
export const addPlat = (plat: any, categorie: string) => async (dispatch: any, getState: any) => {

  plat.categorie = categorie
  plat.restaurant = getState().app.restaurantCurrent
  plat.restaurateur = getState().app.membre


  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/creation/plat`,
  {
      method: 'POST',
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        restaurant: getState().app.restaurantCurrent,
        restaurateur: getState().app.membre,
        categorie: categorie,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(plat)
    })
      .then(res => res.json())
      .then(data => {

        updatePlats(categorie, dispatch, getState)
         
      })

  
  
 
}

/**
 * 
 * @param plat_name 
 * @param categorie 
 */
export const deletePlat = (plat_id : string, categorie: string) => async (dispatch: any, getState:any) => {

  const payload = {
    _id : plat_id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/delete/plat`,
  {
    method: "DELETE",
    mode: "cors",
    headers: {
      Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
      restaurant: getState().app.restaurantCurrent,
      restaurateur: getState().app.membre,
      categorie: categorie,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then( res => res.json())
    .then( data => {
      updatePlats(categorie, dispatch, getState)
    
    })



}

/**
 * 
 * @param plat 
 * @param categorie 
 */
export const modifierPlat = (plat: any) => async (dispatch: any, getState: any) => {


  const payload = {
    _id: getState().app.plat._id,
    modifierPlat: plat
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/restaurateur/modifier/plat`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        restaurant: getState().app.restaurantCurrent,
        restaurateur: getState().app.membre,
        categorie: getState().app.categorie,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      updatePlats(getState().app.categorie, dispatch, getState)

    })

}

export const setPlat = (plat: {}) => {

  return {
    type: "SET_PLAT",
    payload: plat
      
  }

}

export const setQuantitePlats = (menu: any) : any => (dispatch: any, getState: any) : any => {
  
  let q = 0
  menu.forEach( (item : any) => {
    q = q + item.plats.length
  })

  return q
}

export const setSold = (commandes: any) => (dispatch: any, getState: any) => {
  
  let q = 0
  commandes.forEach((item: any) => {
    q = q + +item.total
  })

  return q
}

const getJsontoCsv = (lines: any) => {
  
  const fields = ['nom', 'food', 'quartier', 'categories', 'plats', 'ratio_plat_cat', 'total_commandes', 'ventes'];
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(lines);
   

    return csv
  
  } catch (err) {
  
  
  }

}

export const desactiverResto = (id: string) => (dispatch: any, getState: any) => {


  const payload = {
    id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/desactiver/resto`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

    })

}


export const activerResto = (id: string) => (dispatch: any, getState: any) => {


  const payload = {
    id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/activer/resto`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

    })

}

export const deleteResto = (id: string) => (dispatch: any, getState: any) => {

  const payload = {
    id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/delete/resto`,
    {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

    })
}


export const findAllCommandesPasse = () => (dispatch: any, getState: any) => {

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/all/commandes/passe`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {

      dispatch({
        type: "SET_COMMANDES_PASSE",
        payload: data.commandes.length
      })

    })
}


export const findAllCommandesCours = () => (dispatch: any, getState: any) => {

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/all/commandes/cours`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: "SET_COMMANDES_COURS",
        payload: data.commandes.length
      })

    })


    // ((item.total - this.props.frais_services) / (1 + this.props.frais_livraison) * this.props.frais_livraison) + this.props.frais_services
}


export const findrevenuesTotal = () => (dispatch: any, getState: any) => {

  let frais_total = 0

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/all/commandes/passe`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {

      data.commandes.forEach( (commande : any) => {
        frais_total += ((commande.total - getState().app.frais_services) / (1 + getState().app.frais_livraison) * getState().app.frais_livraison) + getState().app.frais_services
      });

      dispatch({
        type: "SET_REVENUS",
        payload : frais_total
      })
     

    })

}


export const setRestaurantCurrentByName = (restaurant : string) => (dispatch: any, getState: any) => {

  const payload = {
    name: restaurant
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/resto/name`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body : JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: "SET_RESTAURANT_MODIFIER",
        payload : data.resto[0]
      })
    })

}


export const setModificable = (isModificable: Boolean, membre_id: string = "") => (dispatch : any, getState : any) => {

  if(membre_id !== ""){

    dispatch({
      type: "SET_MEMBRE_ID_A_MODIFIER",
      payload: membre_id
    })

  }


  dispatch({
    type: "SET_MODIFICABLE",
    payload: isModificable
  })
}

export const getMembreToModifier = (id: string) => (dispatch:any, getState:any) => {

  const payload = {
    id: id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/membre/id`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: "SET_MEMBRE_A_MODIFIER",
        payload: data.membre[0]
      })

      dispatch({
        type: "SET_CONSULTER",
        payload: false
      })
    })

}

export const enregistrer = (restaurant : any) => (dispatch : any, getState : any) => {


  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/modifier/resto`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(restaurant)
    })
    .then(res => res.json())
    .then(data => {
     
    })

}

export const getMembres = () => (dispatch:any, getState :any) => {

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/all/membres`,
    {
      method: "GET",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: "SET_MEMBRES",
        payload: data.membres
      })

      dispatch({
        type: "SET_MEMBRE_ID_A_MODIFIER",
        payload: 0
      })
      
    })
}


export const activerMembre = (id: string) => (dispatch: any, getState: any) => {


  const payload = {
    id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/activer/membre`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
    })

}

export const desactiverMembre = (id: string) => (dispatch: any, getState: any) => {


  const payload = {
    id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/desactiver/membre`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

    })

}

export const deleteMembre = (id: string) => (dispatch: any, getState: any) => {

  const payload = {
    id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/delete/membre`,
    {
      method: "DELETE",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

    })
}

export const handleSubmitModificationMembre = (membre : any, membre_id: string) => (dispatch:any, getState :any) => {

  const payload = {
    id: membre_id,
    name: membre.name,
    lastname: membre.lastname,
    email: membre.email,
    solde: membre.solde
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/modifier/membre`,
    {
      method: "PATCH",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {

    })
}

export const setMembreConsulter = (membre_id :string) => (dispatch:any, getState:any) => {


  dispatch({
    type: "SET_CONSULTER",
    payload: true
  })

  
  const payload = {
    id: membre_id
  }

  fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/commandes/passe/membre`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: "SET_COMMANDES_PASSE_MEMBRE",
        payload: data.commandes
      })

   
   
   
      fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/administrateur/commandes/cours/membre`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            Authorization: sessionStorage.getItem("token") ? "Bearer " + sessionStorage.getItem('token') : "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {

          dispatch({
            type: "SET_COMMANDES_COURS_MEMBRE",
            payload: data.commandes
          })

        })
    })
  
}
