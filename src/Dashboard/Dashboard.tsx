import React, { Component } from 'react';
import styles from './Dashboard.module.css'
import cx from "classnames"
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { getRestos, findAllCommandesPasse, findAllCommandesCours, findrevenuesTotal } from '../actions';

class Dashboard extends Component<any, any> {

  state = {
    data: {}
  }

  componentDidMount(){
    this.handleRefreshData(null)
    this.props.findAllCommandesPasse()
    this.props.findAllCommandesCours()
    this.props.findrevenuesTotal()
  }

  handleRefreshData = (e :any | null) => {
    this.props.getRestos()
    if(e){
      e.preventDefault()
    }
    
    setTimeout(()=> {
      
      let labelsdata: string[] = []
      let result: string[] = []
      const rows = this.props.csv.split("\n").slice(1)
      rows.forEach( (row: string) => {
        const resto = row.split(",").slice(0, 1)[0]
        const total = row.split(",").slice(7)[0]
        if(+total > 0){
          labelsdata.push(resto)
          result.push(total)
        }
      });
      this.setState({
        data: {
          labels: labelsdata,
          datasets: [{
            label: 'Ventes',
            data: result,
            backgroundColor: 'rgba(0, 209, 178, .5)',
            borderWidth: 1
          }]
        }
      })
    }, 100)
  }

  render(){      
    return (
      <>
      <div className={styles.content_container}>
        <div className={styles.header}>
          <h1 className="title is-4">Bienvenue au Dashboard</h1>
        </div>
        <div className="has-text-left">
          <button className="button is-primary" onClick={this.handleRefreshData}>Refresh Data</button>
        </div>
        <div className={styles.chart}>
          <Line 
            data={ this.state.data }
            width={1200}
            height={200}
            
            />
        </div>
      </div>
        <div className={cx(styles.content_container, styles.margin_top, "is-centered columns")}>
          <div className={cx(styles.card, "card")}>
            <div className="card-image" >
              <div className="is-size-1">{this.props.restos.length}</div>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content has-text-centered">
                  <p className="title is-6">Nombre de restaurants</p>
                </div>
              </div>
            </div>
          </div>


          <div className={cx(styles.card, "card")}>
            <div className="card-image" >
              <div className="is-size-1">{this.props.commandes_passe}</div>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content has-text-centered">
                  <p className="title is-6">Nombre de commande passés</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles.card, "card")}>
            <div className="card-image" >
              <div className="is-size-1">{this.props.commandes_cours}</div>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content has-text-centered">
                  <p className="title is-6">Nombre de commandes en cours</p>
                </div>
              </div>
            </div>
          </div>


          <div className={cx(styles.card, "card")}>
            <div className="card-image" >
              <div className="is-size-1">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Math.round(this.props.frais_total * 100) / 100)}</div>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content has-text-centered">
                  <p className="title is-6">Les revenues total</p>
                </div>
              </div>
            </div>
          </div>

      </div>
      </>
    )
  }
}


const mapStateToProps = (state: any) => {
  return {
    restos: state.app.restos,
    csv: state.app.csv,
    commandes_passe: state.app.commandes_pasee,
    commandes_cours: state.app.commandes_cours,
    frais_total : state.app.frais_total
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getRestos: () => dispatch(getRestos()),
    findAllCommandesPasse: () => dispatch(findAllCommandesPasse()),
    findAllCommandesCours: () => dispatch(findAllCommandesCours()),
    findrevenuesTotal: () => dispatch(findrevenuesTotal())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)