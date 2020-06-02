import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import styles from './Intranet.module.css';
import cx from 'classnames'
// import MenuManager from '../MenuManager/menu_manager'
import ModifierRestaurant from '../Restaurants/restaurant'
import ListeRestaurants from '../ListeRestaurants/liste_restaurants'
import { connect } from 'react-redux'
import Dashboard from '../Dashboard/Dashboard';
import { getRestos } from '../actions';
import ListMembres from '../LIstMembres/ListMembres';


class Intranet extends Component<any> {

  componentDidMount() {
    this.props.getRestos()
  }

  handleDeconnexion = (e: any) => {
    e.preventDefault()
    sessionStorage.clear()
    localStorage.clear()
    window.location.href = "/"
  }

  render() {

    if (this.props.authenticated) {
      return (
        <div>

          <div className={cx(styles.intranet, "columns has-background-light")}>

            <div className={styles.sidebar}>
              <aside className="menu">
                <p className={cx(styles.menu_label, "menu-label has-text-centered")}>General</p>
                <ul className="menu-list">
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-home"></i>
                    </div>
                    <a href="/dashboard">Dashboard</a>
                  </li>
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-home"></i>
                    </div>
                    <a href="/dashboard/restaurants">Restaurants</a>
                  </li>
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className=" fas fa-qrcode"></i>
                    </div>
                    <a href="/dashboard/accueil">{this.props.membre}</a>
                  </li>
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={styles.icon_sidebar}>
                     <i className="fas fa-sign-out-alt"></i>
                    </div>
                    <a href="/" onClick={this.handleDeconnexion}>Déconnexion</a>
                  </li>
                </ul>
                <p className={cx(styles.menu_label, "menu-label has-text-centered")}>Administration</p>
                <ul className="menu-list">
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-cogs"></i>
                    </div>
                    <a href="/dashboard/modifier">Modifier Restaurant</a>
                  </li>
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-plus"></i>
                    </div>
                    <a href="/dashboard/membres">Gérer membres</a>
                  </li>
                
                  
                </ul>
                <p className={cx(styles.menu_label, "menu-label has-text-centered")}>Transactions</p>
                <ul className="menu-list">
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-credit-card"></i>
                    </div>
                    <a href="/dashboard" >Payments</a>
                  </li>
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                    <Link to="/dashboard" >Transfers</Link>
                  </li>
                  <li className={cx("columns is-vcentered is-marginless is-paddingless", styles.item)}>
                    <div className={cx(styles.icon_sidebar, "icon-sidebar")}>
                      <i className="fas fa-balance-scale"></i>
                    </div>
                    <a href="/dashboard" >Balance</a>
                  </li>
                </ul>
              </aside>
            </div>

            <div className="column is-full is-paddingless">

              <Router>
                <Switch>

                  <Route exact path="/dashboard" component={Dashboard}/>
                  <Route exact path="/dashboard/restaurants" component={ListeRestaurants} />
                  <Route exact path="/dashboard/modifier" component={ModifierRestaurant} />
                  <Route exact path="/dashboard/membres" component={ListMembres} />
                </Switch>
              </Router>
            </div>

          </div>




        </div>
      )
    } else {
      return (
        <div>Access denied</div>
      )
    }

    
  }

}


const mapStateToProps = (state: any) => {
  return {
    authenticated: state.app.authenticated,
    membre: state.app.membre,
    restos: state.app.restos,
    csv: state.app.csv
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getRestos: () => dispatch(getRestos())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Intranet)