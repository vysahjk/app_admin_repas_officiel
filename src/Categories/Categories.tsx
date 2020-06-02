import React, { Component } from 'react';
import styles from './categories.module.css'
import cx from 'classnames'
import FormPlat from './formplat'
import { connect } from 'react-redux';
import { deleteCategorie, setPlats, setPlat, deletePlat, setCategorieByRestaurant} from '../actions'


class Categories extends Component<any, any> {

  constructor(props : any){
    super(props)

    this.state = {
      new_categorie: ""
    }
  }
    
  handleDeleteCategorie = (restaurant : any, item: any, e: any) => {
    e.preventDefault()
    this.props.deleteCategorie(item._id)
    
  }
  
  handlPlats = (e: any) => {
    e.preventDefault()    
    this.props.categoriesCurrents.forEach( (categorie: any, index: number) => {
      if(e.target.innerHTML === categorie.categorie){
        this.props.sendPlatsCurrent(categorie.plats, e.target.innerHTML)
      }
    });

  }

  handleSubmitCategorie = (e: any) => {
    e.preventDefault()
    this.props.sendCategorie(this.state.new_categorie)
  }

  handleSetPlat = (plat : {} = {}, e: any) => {
    this.props.sendPlat(plat)
  }

  handleDeletePlat = (plat_id : string, e: any) => {
    e.preventDefault()
    console.log(plat_id)
    this.props.deletePlat(plat_id, this.props.categorie)
  }

  handlerMenu(e: any | null) {
    let modal = document.getElementById('modal_page')
    if (modal) {
      modal.style.display = "block"
    }


  }

  render() {    
    return (
      <div className={cx(styles.menu_manager_content, "columns")}>

        <div className="column is-3">
          <form className="column field" onSubmit={this.handleSubmitCategorie}>
            <div className="columns is-vcentered">
              <div className="column is-2 icon-sidebar">
                      <i className="fas fa-plus"></i>
              </div>
              <div className="button is-info is-outlined"><strong>Categorie</strong></div>
              <input 
                className={cx(styles.input_plus, "input")} 
                type="text" 
                value={this.state.new_categorie}
                onChange={(e) => this.setState({ new_categorie : e.target.value})}
                />
            </div>
          </form>
          <div className="column">
            {
              this.props.categoriesCurrents.map((item : any, key : any) => {
                    return (
                      <div key={key} className="columns has-background-light is-vcentered">
                        <div className="column is-3"><strong>Cat: {key + 1}</strong></div>
                        <button 
                          className={
                            cx(styles.btn_cat, 
                            "column is-6 button is-marginless is-paddingless", 
                            this.props.categorie === item.categorie ? "has-background-primary has-text-dark" : ""
                          )}

                          onClick={this.handlPlats}>{item.categorie}</button>
                        <button 
                          className={cx(styles.btn_delete, "column button is-marginless is-paddingless")} 
                          onClick={(e) => this.handleDeleteCategorie(this.props.restaurantCurrent, item, e)} >
                        
                          <strong>Suprimmer</strong>
                        </button>
                      </div>
                    )
              })
            }
          </div>
        </div>
             
        <div className="column is-3">
          <div className="column field">
            <div className="columns">
              <div className={cx(styles.title_plats, "button is-info is-outlined columns")} onClick={(e) => this.handlerMenu(e)}>
                
                {
                  this.props.platsCurrents.length === 0 ? 
                    <p><strong>Vous voulez créer un plat ?</strong></p> : 
                    <p><strong>Liste de: <em>{this.props.categorie}</em>, clic pour créer un plat ici!!</strong></p>
                }
              
              </div>
            </div>
          </div>
          <div className="column field">  
          {
            this.props.platsCurrents.map( (plat: any, key: number) => {
              return (
                <div key={key} className={cx(styles.list_plats, "columns is-vcentered has-background-light")}>
                  <div className="column is-1"><strong>{key + 1}</strong></div>
                  <button 
                    className={
                      cx(styles.btn_cat, 
                      "column is-8 button is-marginless is-paddingless",
                        this.props.plat === plat.name ? "has-background-primary has-text-dark" : ""
                      )} 
                    onClick={(e) => this.handleSetPlat(plat, e)}>{plat.name}</button>
                  <button className={cx(styles.btn_delete, "column is-3 button is-marginless is-paddingless")} onClick={(e) => this.handleDeletePlat(plat._id, e)}><strong>Suprimmer</strong></button>
                  </div>
              )
            })
          }
          </div>
        </div>
        
        
        <FormPlat categoriecurrent={this.props.categorie}/>
        

      </div>
    )
  }
}


const mapStateToProps = (state: any) => {
  return {
    authenticated: state.app.authenticated,
    membre: state.app.membre,
    categorie: state.app.categorie,
    categoriesCurrents: state.app.categoriesCurrents,
    restaurantCurrent: state.app.restaurantCurrent,
    platsCurrents: state.app.platsCurrents,
    plat: state.app.plat
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    sendPlat: (plat : {}) => dispatch(setPlat(plat)),
    sendPlatsCurrent: (plats: Array<any>, categorie: string) => dispatch(setPlats(plats, categorie)),
    sendCategorie: (categorie : string) => dispatch(setCategorieByRestaurant(categorie)),
    deleteCategorie: (categorie: string) => dispatch(deleteCategorie(categorie)),
    deletePlat: (plat_id: string, categorie: string) => dispatch(deletePlat(plat_id, categorie)),
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)
