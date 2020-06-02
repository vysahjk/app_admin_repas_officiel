import React, { Component } from 'react';
import styles from './ListMembres.module.css'
import cx from 'classnames'
import { connect } from 'react-redux'
import { setQuantitePlats, setSold, getMembres, desactiverMembre, activerMembre, deleteMembre, setModificable, getMembreToModifier, handleSubmitModificationMembre, setMembreConsulter } from '../actions'
import CommandesPasse from './CommandesPasse';

class ListeMembres extends Component<any, any>{

  state = {
    name : "",
    lastname: "", 
    email: "",
    solde: 0
  }

  componentDidMount = () => {
    this.props.getMembres()

  }

  handleRefreshData = (e: any) => {
    e.preventDefault()
    this.props.getMembres()
  }

  handlerJSON = (e: any) => {
    e.preventDefault()
    this.download("SEP=,\n" + this.props.csv)
  }


  download = (data: any) => {
    const blob = new Blob([data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('hidden', '')
    a.setAttribute('href', url)
    a.setAttribute('download', "testfile.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    this.setState({ lines: [] })
  }

  handleMembre = (e :any) => {
    e.preventDefault()
    this.props.setModificable(true, e.target.value)
    this.props.getMembreToModifier(e.target.value)
  }
 
  render() {
    return (
      <>

      <div className={styles.content_container}>

        <div className={styles.header}>
          <h1 className="title is-4">Liste des membres</h1>
        </div>
        <div className="has-text-left">
        </div>
        <div className="columns is-full has-text-right container">



            <div className={cx(styles.menu_manager, "menu_manager column is-12")}>
              <div className="columns">
                <div className="column is-5">
                  <div>
                    <div className="field">
                      <p className="control has-icons-left">
                        <span className="select">
                          <select onChange={this.handleMembre}>
                            <option defaultValue="" hidden>Selectionner un Membre pour modifier</option>
                            {
                              this.props.membres.map((membre: any, index: number) => {
                                return <option className="has-text-dark" key={index} value={membre._id}>{membre.name}</option>
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







     
            <div className="column is-2">
              <button className="button is-primary" onClick={this.handleRefreshData}>Refresh Data</button>
            </div>
            <div className="has-text-left column">
              <button onClick={this.handlerJSON} className="button is-primary">Exporter CSV</button>
            </div>
          
        </div>
        <div className={cx(styles.content, "column is-full has-background-light")}>
          <table className="table">
            <thead >
              <tr >
                <th className="has-text-centered">Pos.</th>
                <th className="has-text-centered">Nom</th>
                <th className="has-text-centered">Last name</th>
                <th className="has-text-centered">Email</th>
                <th className="has-text-centered">Solde</th>
                <th className="has-text-centered">Téléphone</th>
                <th className="has-text-centered">Type</th>
                <th className="has-text-centered">Consulter</th>
                <th className="has-text-centered">Enregistrer</th>
                <th className="has-text-centered">Cancel</th>
                <th className="has-text-centered">Activer/Desactiver</th>
                <th className="has-text-centered">Suprimmer</th>
              </tr>
            </thead>
            <tbody>
              {
                this.props.membres.map((membre: any, key: number) => {

                  return (
                    <tr key={key} className="title is-6 has-text-centered">
                      <th className="has-text-centered">{key + 1}</th>

                        {
                          membre._id === this.props.membre_id_a_modifier ?
                            this.props.modificable ?
                            <td className="has-text-left is-capitalized">
                              <div>
                                <td className="has-text-left is-capitalized">{membre.name}</td>
                                <input className="input is-small" type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value})} />
                              </div>
                            </td>
                            :
                            <td className="has-text-left is-capitalized">{ membre.name }</td>
                          :
                          <td className="has-text-left is-capitalized">{membre.name}</td>
                        }

                      
                      
                        {
                          membre._id === this.props.membre_id_a_modifier ?
                            this.props.modificable ?
                              <td className="has-text-left is-capitalized">
                                <div>
                                  <td className="has-text-left is-capitalized">{membre.lastname || 'lastname'}</td>
                                <input className="input is-small" type="text" value={this.state.lastname} onChange={e => this.setState({ lastname: e.target.value })} />
                                </div>
                              </td>
                              :
                              <td className="has-text-left is-capitalized">{membre.lastname}</td>
                            :
                            <td className="has-text-left is-capitalized">{membre.lastname}</td>
                        }
                      
                      
                        {
                          membre._id === this.props.membre_id_a_modifier ?
                            this.props.modificable ?
                              <td className="has-text-left">
                                <div>
                                  <td className="has-text-left">{membre.email}</td>
                                <input className="input is-small" type="Email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
                                </div>
                              </td>
                              :
                              <td className="has-text-left">{membre.email}</td>
                            :
                            <td className="has-text-left">{membre.email}</td>
                        }
                      
                      
                        {
                          membre._id === this.props.membre_id_a_modifier ?
                            this.props.modificable ?
                              <>
                              <td className="has-text-left is-capitalized">
                                <div>
                                  <td className="has-text-left is-capitalized">{membre.solde}</td>
                                  <input className="input is-small" type="number" value={this.state.solde} onChange={e => this.setState({ solde: e.target.value })} />
                                </div>
                              </td>
                              </>
                              :
                            <td className="has-text-left is-capitalized">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(membre.solde)}</td>
                            :
                          <td className="has-text-left is-capitalized">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(membre.solde)}</td>
                        }
                    
                      <td className="has-text-centered">{membre.telephone}</td>
                      <td className="has-text-centered is-capitalized">{membre.type}</td>
                      <td className="has-text-centered">
                        <div className="buttons are-small">
                          <button className="button is-primary" onClick={e => this.props.setMembreConsulter(membre._id)}>Consulter</button>
                        </div>
                      </td>


                      <td className="has-text-centered">
                        <div className="buttons are-small">
                          {
                            membre._id === this.props.membre_id_a_modifier ?
                              this.props.modificable ?
                                <button className="button is-success" onClick={e => this.props.handleSubmitModificationMembre(this.state, membre._id)}>Enregistrer</button>
                                :
                                <button className="button is-success" disabled>Enregistrer</button>
                            :
                              <button className="button is-success" disabled>Enregistrer</button>
                          }

                        </div>
                      </td>
                      <td className="has-text-centered">
                        <div className="buttons are-small">
                          {
                            membre._id === this.props.membre_id_a_modifier ?
                              this.props.modificable ?
                                <button className="button is-danger" onClick={e => this.props.setModificable(false)}>Cancel</button>
                              :
                                <button className="button is-danger" disabled onClick={e => this.props.setModificable(false)}>Cancel</button>
                            :
                              <button className="button is-danger" disabled onClick={e => this.props.setModificable(false)}>Cancel</button>
                          }
                          
                        </div>
                      </td>

                      <td className="has-text-centered">
                        <div className="buttons are-small">
                          {
                            membre.active ? 
                              <button className="button is-info" onClick={e => this.props.desactiverMembre(membre._id, e)}>Desactiver</button>
                            :
                              <button className="button is-success" onClick={e => this.props.activerMembre(membre._id, e)}>Activer</button>
                          }
                          
                        </div>
                      </td>
                      <td className="has-text-centered">
                        <div className="buttons are-small">
                          {
                            !membre.active ? 
                              <button className="button is-danger" onClick={e => this.props.deleteMembre(membre._id, e)}>Suprimmer</button> 
                            : 
                              <button className="button is-danger" disabled>Suprimmer</button>  
                          }
                        </div>
                      </td>

                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
            {
              this.props.consulter ?
              <>

                <div>
                  <CommandesPasse commandes={this.props.commandes_pasee_membre} type={"Passés"} />
                </div>

                <div>
                  <CommandesPasse commandes={this.props.commandes_cours_membre} type={"en Cours"}/>
                </div>

              </>
              :

              <div>
                
              </div>
              
          }


        
      </div>
    </>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    membres: state.app.membres,
    csv: state.app.csv,
    modificable: state.app.modificable,
    membre_id_a_modifier: state.app.membre_id_a_modifier,
    membre_a_modifier: state.app.membre_a_modifier,
    commandes_pasee_membre: state.app.commandes_pasee_membre,
    commandes_cours_membre: state.app.commandes_cours_membre,
    consulter: state.app.consulter
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setQuantitePlats: (menu: any) => dispatch(setQuantitePlats(menu)),
    setSold: (commandes: any) => dispatch(setSold(commandes)),
    getMembres: () => dispatch(getMembres()),
    desactiverMembre: (id: string) => dispatch(desactiverMembre(id)),
    activerMembre: (id: string) => dispatch(activerMembre(id)),
    deleteMembre: (id: string) => dispatch(deleteMembre(id)),
    setModificable: (isMoficable: Boolean, membre_id: string) => dispatch(setModificable(isMoficable, membre_id)),
    getMembreToModifier: (id: string) => dispatch(getMembreToModifier(id)),
    handleSubmitModificationMembre: (membre: any, membre_id: string) => dispatch(handleSubmitModificationMembre(membre, membre_id)),
    setMembreConsulter : (membre_id :string) => dispatch(setMembreConsulter(membre_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListeMembres)