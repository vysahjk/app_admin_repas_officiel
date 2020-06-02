import React, { Component} from 'react';
import styles from './liste_restaurants.module.css'
import cx from 'classnames'
import { connect } from 'react-redux'
import { setQuantitePlats, setSold, getRestos, desactiverResto, activerResto, deleteResto } from '../actions'

class ListeRestaurants extends Component<any, any>{

  handleRefreshData = (e : any) => {
    e.preventDefault()
    this.props.getRestos()
  }

  handlerJSON = (e :any) => {
    e.preventDefault()
    this.download("SEP=,\n" + this.props.csv)
  }


  download = (data : any) => {
    const blob = new Blob([data], { type : 'text/csv'})
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

   render(){
    return (
      <div className={styles.content_container}>
        <div className={styles.header}>
          <h1 className="title is-4">Liste des {this.props.restos.length} restaurants que vous possedez</h1>
        </div>
        <div className="has-text-left">
        </div>
        <div className="columns is-full has-text-right container">
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
                <th className="has-text-centered">Food</th>
                <th className="has-text-centered">Quartier</th>
                <th className="has-text-centered">Categories</th>
                <th className="has-text-centered">Plats</th>
                <th className="has-text-centered">Plats / Ctd. Cat.</th>
                <th className="has-text-centered">Commandes Total</th>
                <th className="has-text-centered">Ventes</th>
                <th className="has-text-centered">Desactiver/Activer</th>
                <th className="has-text-centered">Delete</th>
              </tr>
            </thead>
            <tbody>
            {
              this.props.restos.map( (resto : any, key:number) => {
                
                return (
                  <tr key={key} className="title is-6 has-text-centered">
                <th className="has-text-centered">{key + 1}</th>
                <td className="has-text-left">{resto.name}</td>
                <td className="has-text-left">{resto.food}</td>
                <td className="has-text-centered is-capitalized">{resto.quartier}</td>
                <td className="has-text-centered">
                  {
                    resto.menu.length
                  }
                </td>
                <td className="has-text-centered">
                  {
                    this.props.setQuantitePlats(resto.menu)
                  }
                </td>
                <td className="has-text-centered">
                  {
                    Math.round(this.props.setQuantitePlats(resto.menu) / (resto.menu.length === 0 ? 1 : resto.menu.length) * 100) / 100
                  }
                </td>
                <td className="has-text-centered">
                  {
                    resto.commandes.length
                  }
                </td>
                <td className="has-text-right">
                  {
                    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(this.props.setSold(resto.commandes))
                  }
                </td>
                {
                  resto.active ? 
                    <td className="has-text-centered">
                      <button className="button is-info" onClick={ e => this.props.desactiverResto(resto._id, e)}>Desactiver</button>
                    </td>
                    :
                    <td className="has-text-centered">
                          <button className="button is-primary" onClick={e => this.props.activerResto(resto._id, e)}>Activer</button>
                    </td>
                }
                <td className="has-text-right">
                      {
                        resto.active ?
                          <button className="button is-danger" disabled>Delete</button>
                          :
                          <button className="button is-danger" onClick={e => this.props.deleteResto(resto._id, e)}>Delete</button>
                      }
                     
                </td>
              </tr>
                )
              })
            }
            </tbody>
          </table>             
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state :any) => {
  return {
    restos: state.app.restos, 
    csv: state.app.csv
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    setQuantitePlats: (menu: any) => dispatch(setQuantitePlats(menu)), 
    setSold: (commandes: any) => dispatch(setSold(commandes)),
    getRestos: () => dispatch(getRestos()), 
    desactiverResto: (id: string) => dispatch(desactiverResto(id)),
    activerResto: (id: string) => dispatch(activerResto(id)),
    deleteResto : (id : string) => dispatch(deleteResto(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListeRestaurants)