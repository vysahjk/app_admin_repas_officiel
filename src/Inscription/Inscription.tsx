import React, { Component } from 'react';
import cx from 'classnames'
import styles from './Inscription.module.css';
import { connect } from 'react-redux';
import { inscription } from '../actions';

class Inscription extends Component<any, any>{

  state = {
    phone: "",
    code: "",
    username: "",
    password: "",
    email: "",
    verified: false
  }


  handlePhone = (e: any) => {
    e.preventDefault();
    
  }

  handleSubmitPhone(e: any) {
    e.preventDefault()
    fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/authentication/verification/telephone/${this.state.phone}`)
      .then(res => res.json())
      .then(data => console.log(data))
  }


  handleCode = (e: any) => {
    e.preventDefault();
    this.setState({ code: e.target.value })
   
  }

  handleSubmitCode(e: any){
    e.preventDefault()
    fetch(`${process.env.REACT_APP_HOST_NAME}:${process.env.REACT_APP_PORT_API}/api/authentication/verification/code/${this.state.code}/${this.state.phone}`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.message !== 'pending') {
          this.setState({ verified: true })
        } else {
          this.setState({ verified: false })
        }
      })
  }

  handleInscription = (e: any) => {
    e.preventDefault()
    this.props.sendInscription(this.state)
  }


  renderNotification (){
    if(this.state.verified){
      return (
        <p className="help is-danger">code vérifié</p>
      )
    }else{
      return (
        <p className="help is-success">votre code n'a pas été encore vérifié</p>
      )
    }
  }


  renderInscription(){


    if(true){
      return (
        <div>
          
          <form onSubmit={this.handleInscription}>

              <div className="field">
                <label className="label">Username</label>
                <div className="control has-icons-left">
                  <input 
                    className="input is-success" 
                    type="text" 
                    placeholder="username"
                    value={this.state.username}
                  onChange={(e) => this.setState({ username: e.target.value})} />

                  <span className="icon is-small is-left">
                    <i className="fas fa-user"></i>
                  </span>

                </div>
              </div>

              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                  <input 
                    className="input is-success" 
                    type="email" 
                    placeholder="Email" 
                    value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>

                </div>
              </div>

              <div className="field">
                <label className="label">Password</label>
                <p className="control has-icons-left">
                  <input 
                    className="input is-success" 
                    type="password" 
                    placeholder="Password" 
                    value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })} />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                </p>
              </div>

              <div className="field is-grouped">
                <div className="control">
                <button type="submit" className="button is-primary">Submit</button>
                </div>
                
              </div>

          </form>

        </div>
      )
    }
  }

  render(){
    return (
      <div className={cx(styles.formulaire, "container column is-3")}>
        <div>
          <div className="title">Démarrer</div>
          <div className="subtitle">Avant de commencer, on a besoin de quelques informations.</div>
          <br/>
        </div>


        <form className="column is-fluid is-full" onSubmit={this.handleSubmitPhone.bind(this)}>
          <div className="field">
              <label className="label">Vérification téléphone portable</label>
              <div className="control has-icons-left">
                <span className="icon is-small is-left">
                  <i><strong>+33</strong></i>
                </span>
              <input 
                className="input" 
                type="text" 
                placeholder="téléphone portable" 
                value={this.state.phone}
                disabled
                onChange={this.handlePhone}
                ref="phone"/>
              </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-primary is-hidden">Envoyer le code</button>
            </div>

          </div>
        
        </form>


        <form className="column is-fluid is-full" onSubmit={this.handleSubmitCode.bind(this)}>

          <div className="field">
            <label className="label">Vérifier votre code d'accés</label>
            <div className="control has-icons-left">
              <input 
                className="input is-success" 
                type="text" placeholder="code" 
                value={this.state.code}
                disabled
                onChange={this.handleCode}
                ref="code"/>
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>

            </div>
            
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-primary is-hidden">Vérifier votre code</button>
            </div>
        
          </div>
          
          {this.renderNotification()}

        </form>
        
        {this.renderInscription()}
     
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    sendInscription : (user: any) => dispatch(inscription(user))
  }
}

export default connect(null, mapDispatchToProps)(Inscription)