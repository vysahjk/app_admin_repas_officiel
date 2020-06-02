import React, { Component } from 'react';
import styles from './menu_manager.module.css'
import cx from 'classnames'
import Categories from "../Categories/Categories"
import { connect } from 'react-redux';
import { getRestos, getCategoriesByRestaurant, setRestaurantCurrent } from '../actions'

class MenuManager extends Component<any>{

  componentDidMount(){
    this.props.getAllRestos()
  }

  handleRestaurant = (e: any) => {
    e.preventDefault()

    this.props.setRestaurant(e.target.value)
    this.props.getAllCategories(e.target.value)    
  }

  render(){
    
    return (
      <div className={styles.content_container}>
        <div className={styles.header}>
          <h1 className="title has-text-white is-4 has-text-dark">Menu Manager</h1>
        </div>

        <div className={cx(styles.menu_manager, "menu_manager column is-12")}>
          <div className="columns">
            <div className="column is-5">
              <div>
                <div className="field">
                  <p className="control has-icons-left">
                    <span className="select">
                      <select onChange={this.handleRestaurant}>
                        <option defaultValue="" hidden>Selectionner un restaurant</option>
                        {
                          this.props.restos.map( (resto : any, index : number) => {
                            return <option className="has-text-dark" key={index} value={resto.name}>{resto.name}</option>
                          })
                        }
                      
                      </select>
                    </span>
                    <span className="icon is-small is-left">
                      <i className="fas fa-utensils"></i>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
           
            
          </div>

        </div>
        
        <br/>

        { 
          this.props.restaurantCurrent ? 
            <div className={styles.info_categories}>
              <div className="column is-5 notification is-primary">
                <strong>Vous avez {this.props.categoriesCurrents.length} catégorie dans votre restaurant:  <em className="has-text-grey-dark">{this.props.restaurantCurrent}</em></strong>
              </div>
            </div> : 
            <div className={styles.info_categories}>
              <div className="column is-5 notification is-primary">
                <strong>Selectionner un restaurant pour commencer</strong>
              </div>
            </div>
        }

        
        
        {this.props.restaurantCurrent ? <div className={cx(styles.menu_manager, "column is-12")}><Categories /></div> : <div></div>}
        
      </div>
    )
  }
}


const mapStateToProps = (state: any) => {
  return {
    authenticated: state.app.authenticated,
    membre: state.app.membre,
    restos: state.app.restos,
    categoriesCurrents: state.app.categoriesCurrents,
    restaurantCurrent: state.app.restaurantCurrent,
    plat: state.app.plat
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getAllRestos: (restaurateur: string) => dispatch(getRestos()),
    getAllCategories: (restaurant: string) => dispatch(getCategoriesByRestaurant(restaurant)),
    setRestaurant: (restaurant: string) => dispatch(setRestaurantCurrent(restaurant))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager)