import React , { Component } from 'react';
import styles from './restaurant.module.css'
import cx from 'classnames'
import { connect } from 'react-redux';
import { resizeImage, getRestos, setRestaurantCurrentByName, setModificable, enregistrer } from '../actions';


class CreationRestaurant extends Component<any, any> {

  state = {
    _id: this.props.restaurantModifier._id || "",
    name: this.props.restaurantModifier.name || "",
    adresse: this.props.restaurantModifier.adresse || "",
    photo: this.props.restaurantModifier.photo || "",
    food: this.props.restaurantModifier.food || "",
    position: this.props.restaurantModifier.position || "",
    codepostal: this.props.restaurantModifier.codepostal || "",
    ville: this.props.restaurantModifier.ville || "",
    quartier: this.props.restaurantModifier.quartier || "",
    pays: this.props.restaurantModifier.pays || "france",
    active: true,
    restaurateur: this.props.restaurantModifier.restaurateur || ""
  }

  componentDidMount() {
    this.props.getAllRestos()
  }

  handleNameSubmit = (e: any) => {
    e.preventDefault()
    let steper = document.getElementById('steper')
    if (steper) {
      steper.style.transform = `translateX(-100%)`;
    }

  }

 


  onFileDrop = (e: any) => {
    e.preventDefault()
    
    let read = new FileReader()
    
    read.readAsDataURL(e.dataTransfer.files[0])
    
    read.onload = async () => {

      let image = await this.props.resizeImage(read.result)
      let formData = new FormData();
      formData.append('image', image)
      formData.append('album', 'cpSlZKkf2lcD47v')


      let imgur_image_pre = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TOKEN_IMGUR}`
        },
        body: formData
      })

      let json_pre = await imgur_image_pre.json()

      this.setState({ photo : json_pre.data.link})

    }   
  }

  onFileOver = (e: any) => {
    e.preventDefault()
    console.log("drag over")
  }

  handleRetourButton = (e: any) => {
    e.preventDefault()
    let steper = document.getElementById('steper')
    if (steper) {
      steper.style.transform = `translateX(0)`;
    }
  }

  handleRestaurant = (e: any) => {
    e.preventDefault()
    this.props.setRestaurantByName(e.target.value)
  }

  handleModificationRestaurant = (e: any) => {
    e.preventDefault()

  }

  render() {
    return(
      <div className={styles.content_container}>
        <div className={styles.header}>
          <h1 className="title has-text-white is-4 has-text-dark">Modification d'un restaurant</h1>
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
                          this.props.restos.map((resto: any, index: number) => {
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


        {
          this.props.modificable ? 

            <div id="steper">

              <div className="columns is-12">
                <div className="container column is-4">

                  <div className="column">

                    <div className="column container">
                      <label className="label" htmlFor="phone">Nom Restaurant ?</label>
                      <div className="control has-icons-left">
                        <span className="icon is-small is-left">
                          <i className="fa fa-utensils"></i>
                        </span>
                        <input
                          className="input"
                          type="text"
                          placeholder="ex: La Fourmi"
                          value={this.state.name}
                          onChange={(e) => this.setState({ name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="column container">
                      <label className="label" htmlFor="phone">Quel genre de repas propose le Restaurant ?</label>
                      <div className="control has-icons-left">
                        <span className="icon is-small is-left">
                          <i className="fa fa-utensils"></i>
                        </span>
                        <input
                          className="input"
                          type="text"
                          placeholder="ex: Burgers, Pizzas, Sushi..."
                          value={this.state.food}
                          onChange={(e) => this.setState({ food: e.target.value })}
                        />
                      </div>

                    </div>

                  </div>


                </div>
              </div>



              <div className="columns is-12">

                <div className="column container is-8">
                  <h2 className="subtitle" >Où se trouve le restaurant ?</h2>
                  <br />
                  <div className="columns">
                    <div className="column container is-7">
                      <label className="label has-text-left" htmlFor="code">Adresse - <em className="subtitle is-7">(Obligatoire)</em></label>
                      <div className="control has-icons-left">
                        <span className="icon is-small is-left">
                          <i className="fa fa-map-marked-alt"></i>
                        </span>
                        <input
                          className="input"
                          type="text"
                          placeholder="ex: 187 cours emile zola"
                          value={this.state.adresse}
                          onChange={(e) => this.setState({ adresse: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column container">

                    <div className="columns">

                      <div className="column container is-8">

                        <div className="columns">
                          <div className="column">
                            <label className="label has-text-left" htmlFor="code">Code Postal - <em className="subtitle is-7">(obligatoire)</em></label>
                            <div className="control has-icons-left">
                              <span className="icon is-small is-left">
                                <i className="fa fa-list-ol"></i>
                              </span>
                              <input
                                className="input"
                                type="text"
                                placeholder="ex: 69100"
                                value={this.state.codepostal}
                                onChange={(e) => this.setState({ codepostal: e.target.value })}
                              />
                            </div>

                          </div>

                          <div className="column">
                            <label className="label has-text-left" htmlFor="code">Ville - <em className="subtitle is-7">(obligatoire)</em></label>
                            <div className="control has-icons-left">
                              <span className="icon is-small is-left">
                                <i className="fa fa-city"></i>
                              </span>
                              <input
                                className="input"
                                type="text"
                                placeholder="ex: Villeurbanne"
                                value={this.state.ville}
                                onChange={(e) => this.setState({ ville: e.target.value })}
                              />
                            </div>

                          </div>

                          <div className="column">
                            <label className="label has-text-left" htmlFor="code">Quartier - <em className="subtitle is-7">(obligatoire)</em></label>
                            <div className="control has-icons-left">
                              <span className="icon is-small is-left">
                                <i className="fa fa-city"></i>
                              </span>
                              <input
                                className="input"
                                type="text"
                                placeholder="ex: Republique"
                                value={this.state.quartier}
                                onChange={(e) => this.setState({ quartier: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="column container is-8">
                    <div className="columns">
                      <div className="column is-3">
                        <label className="label has-text-left" htmlFor="code">Pays - <em className="subtitle is-7">(obligatoire)</em></label>
                        <div className="control has-icons-left">
                          <span className="icon is-small is-left">
                            <i className="fas fa-globe-africa"></i>
                          </span>
                          <input
                            className="input"
                            type="text"
                            placeholder="ex: France"
                            value={this.state.pays}
                            onChange={(e) => this.setState({ pays: e.target.value })}
                          />
                        </div>

                      </div>

                    </div>
                  </div>


                  <div className="column container is-8">
                    <div className="field is-grouped">
                      <div className="control">
                        <button type="submit" className="button is-danger" onClick={e => this.props.enregistrer(this.state)}>Enregistrer</button>
                      </div>
                      <div className="control">
                        <button type="submit" className="button is-info" onClick={e => this.props.setModificable(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>



                </div>




                <div className="container column">
                  <h2 className="subtitle">Vous avez une belle image pour votre restaurant ?</h2>
                  <br />
                  <label className="label">Drag and drop votre image</label>
                  <div className={cx(styles.dropzone, "column container")} onDragOver={this.onFileOver} onDrop={this.onFileDrop} >
                    <img src={this.state.photo} alt="" />
                  </div>

                  <br />
                  <div className="column uploads has-text-left subtitle is-7"><strong>Link: <a href={this.state.photo}>{this.state.photo}</a></strong></div>

                </div>
              </div>
            </div>
              :

            <div id="steper">

              <div className="columns is-12">
                <div className="container column is-4">

                  <div className="column">

                    <div className="column container">
                      <label className="label" htmlFor="phone">Nom Restaurant ?</label>
                      <div className="control has-icons-left">
                        <span className="icon is-small is-left">
                          <i className="fa fa-utensils"></i>
                        </span>
                        <input
                          className="input"
                          type="text"
                          placeholder="ex: La Fourmi"
                          disabled
                          value={this.props.restaurantModifier.name}
                        />
                      </div>
                    </div>
                    <div className="column container">
                      <label className="label" htmlFor="phone">Quel genre de repas propose le Restaurant ?</label>
                      <div className="control has-icons-left">
                        <span className="icon is-small is-left">
                          <i className="fa fa-utensils"></i>
                        </span>
                        <input
                          className="input"
                          type="text"
                          placeholder="ex: Burgers, Pizzas, Sushi..."
                          value={this.props.restaurantModifier.food}
                          disabled
                        />
                      </div>

                    </div>

                  </div>


                </div>
              </div>



              <div className="columns is-12">

                <div className="column container is-8">
                  <h2 className="subtitle" >Où se trouve le restaurant ?</h2>
                  <br />
                  <div className="columns">
                    <div className="column container is-7">
                      <label className="label has-text-left" htmlFor="code">Adresse - <em className="subtitle is-7">(Obligatoire)</em></label>
                      <div className="control has-icons-left">
                        <span className="icon is-small is-left">
                          <i className="fa fa-map-marked-alt"></i>
                        </span>
                        <input
                          className="input"
                          type="text"
                          placeholder="ex: 187 cours emile zola"
                          value={this.props.restaurantModifier.adresse}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="column container">

                    <div className="columns">

                      <div className="column container is-8">

                        <div className="columns">
                          <div className="column">
                            <label className="label has-text-left" htmlFor="code">Code Postal - <em className="subtitle is-7">(obligatoire)</em></label>
                            <div className="control has-icons-left">
                              <span className="icon is-small is-left">
                                <i className="fa fa-list-ol"></i>
                              </span>
                              <input
                                className="input"
                                type="text"
                                placeholder="ex: 69100"
                                value={this.props.restaurantModifier.codepostal}
                                disabled
                              />
                            </div>

                          </div>

                          <div className="column">
                            <label className="label has-text-left" htmlFor="code">Ville - <em className="subtitle is-7">(obligatoire)</em></label>
                            <div className="control has-icons-left">
                              <span className="icon is-small is-left">
                                <i className="fa fa-city"></i>
                              </span>
                              <input
                                className="input"
                                type="text"
                                placeholder="ex: Villeurbanne"
                                value={this.props.restaurantModifier.ville}
                                disabled
                              />
                            </div>

                          </div>

                          <div className="column">
                            <label className="label has-text-left" htmlFor="code">Quartier - <em className="subtitle is-7">(obligatoire)</em></label>
                            <div className="control has-icons-left">
                              <span className="icon is-small is-left">
                                <i className="fa fa-city"></i>
                              </span>
                              <input
                                className="input"
                                type="text"
                                placeholder="ex: Republique"
                                value={this.props.restaurantModifier.quartier}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="column container is-8">
                    <div className="columns">
                      <div className="column is-3">
                        <label className="label has-text-left" htmlFor="code">Pays - <em className="subtitle is-7">(obligatoire)</em></label>
                        <div className="control has-icons-left">
                          <span className="icon is-small is-left">
                            <i className="fas fa-globe-africa"></i>
                          </span>
                          <input
                            className="input"
                            type="text"
                            placeholder="ex: France"
                            value={this.props.restaurantModifier.pays}
                            disabled
                          />
                        </div>

                      </div>

                    </div>
                  </div>


                  <div className="column container is-8">
                    <div className="field is-grouped">
                      <div className="control">
                        <button type="submit" className="button is-primary" onClick={e => this.props.setModificable(true)}>Modifier le restaurant</button>
                      </div>
                      
                    </div>
                  </div>



                </div>




                <div className="container column">
                  <h2 className="subtitle">Vous avez une belle image pour votre restaurant ?</h2>
                  <br />
                  <label className="label">Drag and drop votre image</label>
                  <div className={cx(styles.dropzone, "column container")} onDragOver={this.onFileOver} onDrop={this.onFileDrop} >
                    <img src={this.props.restaurantModifier.photo} alt="" />
                  </div>

                  <br />
                  <div className="column uploads has-text-left subtitle is-7"><strong>Link: <a href={this.state.photo}>{this.state.photo}</a></strong></div>

                </div>
              </div>
            </div>
          }
        
          <div className="column container">
            {
              this.props.creation ?
                <div className="notification is-primary has-text-dark">
                  <p>
                    Succès!!. Votre restaurant a bien été modifié
                  </p> 
                </div> : ""
                  
            }
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state : any) => {
  return {
    membre : state.app.membre,
    restos: state.app.restos,
    restaurantModifier : state.app.restaurantModifier,
    modificable: state.app.modificable
  }
}

const mapDispatchToProps = (dispatch : any) => {
  return {
    getAllRestos: (restaurateur: string) => dispatch(getRestos()),
    resizeImage : (image : any) => dispatch(resizeImage(image)),
    setRestaurantByName: (restaurant: string) => dispatch(setRestaurantCurrentByName(restaurant)),
    setModificable : (isMoficable : Boolean) => dispatch(setModificable(isMoficable)),
    enregistrer : (restaurant: any) => dispatch(enregistrer(restaurant))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationRestaurant)