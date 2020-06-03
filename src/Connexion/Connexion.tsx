import React, { Component } from 'react';
import styles from "./Connexion.module.css";
import { connect } from 'react-redux'
import { setCredentials } from '../actions'

class Connexion extends Component<any, any> {

  constructor(props: any) {
    super(props)

    this.state = {
      membre: "",
      password: ""
    }
  }
  
  handleSubmit = (e : any) => {
    e.preventDefault()
    this.props.sendCredentials(this.state.membre, this.state.password)
  }

  render() {    

    return(
      <div className={styles.connexion}>
        <div className="column is-8">
          <img src="https://i.imgur.com/3nxG1Oc.png" alt=""/>
        </div>


        <form onSubmit={this.handleSubmit}>
          <div className="column is-12">
            <div className="title is-1 has-text-dark">Bienvenue sur le Administrateur Dashboard</div>
            <br/>
            <div className="subtitle is-6">
              Boostez votre activité grâce aux données. Suivez vos ventes, observez votre progression et attirez de nouveaux clients grâce à des offres spéciales.
            </div>

           

            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left has-icons-right">
                <input 
                  className="input" 
                  type="text" 
                  placeholder="ex: nicolas"
                  value={this.state.membre}
                  onChange={(e) => this.setState({ membre: e.target.value })}
                 />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Mot de passe</label>
              <p className="control has-icons-left">
                <input
                  className="input is-success"
                  type="password"
                  placeholder="mot de passe"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-primary">Se connecter</button>
              </div>
              <div className="control">
                <a className="button" href="/inscription" target="blank">S'inscrire</a>
                
              </div>
            
            </div>

          </div>
          


        </form>

      </div>
    )
  }
}



const mapStateToProps = (state: any) => {
  return {
    membre: state.app.membre
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    sendCredentials: (email: string, password: string) => dispatch(setCredentials(email, password))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Connexion)
