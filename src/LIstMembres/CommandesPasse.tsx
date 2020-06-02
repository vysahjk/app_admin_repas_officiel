import React from 'react'
import { connect } from 'react-redux'
import styles from './CommandesPasse.module.css'
import cx from 'classnames'
import moment from 'moment'

class CommandePasse extends React.Component<any> {

  render(){
    return (
      <>
        {
          this.props.consulter ?
            <div className={cx(styles.content_compte, "container column")}>
              <div className="column is-full is-marginless is-paddingless">
                <label className="label has-text-left">Historiques de commandes {this.props.type}:</label>
                <table className="table is-hoverable is-size-7">
                  <thead >
                    <tr className="is-selected has-text-dark">
                      <th className={cx(styles.title_table, "has-text-centered")}>Pos.</th>
                      <th className={cx(styles.title_table, "has-text-centered")}>Date</th>
                      <th className={cx(styles.title_table, "has-text-centered")}>Restaurant</th>
                      <th>
                        <table>
                          <thead className={cx(styles.table_nested, "columns")}>
                            <tr className={cx(styles.title_table_nested, "column is-paddingless")}>
                              <td className={styles.subtitle_nested}>Ctd.</td>
                            </tr>
                            <tr className={cx(styles.title_table_nested, "column is-paddingless")}>
                              <td className={styles.subtitle_nested}>Plat</td>
                            </tr>
                            <tr className={cx(styles.title_table_nested, "column is-paddingless")}>
                              <td className={styles.subtitle_nested}>Prix Unit.</td>
                            </tr>
                            <tr className={cx(styles.title_table_nested, "column is-paddingless")}>
                              <td className={styles.subtitle_nested}>Sub-total</td>
                            </tr>

                          </thead>
                        </table>
                      </th>
                      <th className={cx(styles.title_table, "has-text-centered")}>Frais</th>
                      <th className={cx(styles.title_table, "has-text-centered")}>Total</th>

                    </tr>
                  </thead>
                  <tbody className={styles.border_div}>
                    {
                      this.props.commandes.map((item: any, key: number) => {
                        return (
                          <tr key={key} className="title is-7 is-paddingless is-marginless">
                            <th className={cx(styles.border_div, "has-text-centered is-capitalized")}>{key + 1}</th>
                            <td className={cx(styles.border_div, "has-text-left is-capitalized")}>{moment.unix(item.datetime).format('LLLL')}</td>
                            <td className={cx(styles.border_div, "has-text-left is-capitalized")}>{item.restaurant}</td>
                            {
                              item.panier.map((subitem: any, key: number) => {
                                return (
                                  <td key={key} className="columns has-text-centered is-paddingless is-marginless">
                                    <div className="column is-capitalized">{subitem.count}</div>
                                    <div className="column is-capitalized has-text-left">{subitem.value.name}</div>
                                    <div className="column has-text-right">
                                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(subitem.value.prix)}
                                    </div>
                                    <div className="column has-text-right">
                                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(subitem.value.prix * subitem.count)}
                                    </div>


                                  </td>
                                )
                              })
                            }
                            <td className="has-text-right has-background-light">
                              {
                              
                              new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                                ((item.total - this.props.frais_services) / (1 + this.props.frais_livraison) * this.props.frais_livraison) + this.props.frais_services)
                              
                              }
                            </td>
                            <td className="has-text-right has-background-light">
                              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.total)}
                            </td>

                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          :
            <div>slkdjflskdjf</div> 
        }
      </>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    membres: state.app.membres,
    consulter: state.app.consulter,
    frais_services: state.app.frais_services,
    frais_livraison: state.app.frais_livraison
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandePasse)