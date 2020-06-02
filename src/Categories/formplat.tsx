import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './formplat.module.css'
import cx from 'classnames'
import FormCreationPlat from './formcreationplat'
import { modifierPlat, resizeImage, setPlat } from '../actions'

class FormPlat extends Component<any, any> {

  state = {
    modifier: false,
    photo: this.props.plat.photo || "",
    name: this.props.plat.name || "",
    prix: this.props.plat.prix || "",
    description: this.props.plat.description || ""
  }

  handleCloseMenu(e: any | null) {
    let modal = document.getElementById('modal_page')
    if (modal) {
      modal.style.display = "none"
    }
    
  }

  handleModifierPlat = (e: any) => {
    e.preventDefault()
    console.log(this.props.plat)
    this.setState({ modifier : true})
  }

  handleEnvoyerPlat = (e: any) => {
    e.preventDefault()  
    this.props.modifierPlat(this.state)
    this.setState({ modifier: false})

  }
  
  onFileOver = (e: any) => {
    e.preventDefault()
    console.log("drag over")
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

      this.setState({ photo: json_pre.data.link })

    }
  }


  render () {
    
    return (
      
      <div className="column">
        <div className="field">
          <div className="column">
            <div className={cx(styles.info_plat, "button is-info is-outlined")}>
              <p><strong>Vous avez ici toutes les informations sur votre plat</strong></p>
            </div>
          </div>
        </div>
        <div id="modal_page" className="modal">
          <div className="modal-background"></div>
          <div className={cx(styles.modal_content, "modal-content")}>
            <FormCreationPlat categoriecurrent={this.props.categoriecurrent}/>
          </div>
          <button className="modal-close is-large" aria-label="close" onClick={(e) => this.handleCloseMenu(e)}></button>
        </div>


      { 
      
        !this.state.modifier ? 
          <form id="formulaire_info_plat" className="columns">

            <div className="column is-5">
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input className="input" type="text" placeholder="Text input" disabled value={this.props.plat.name} />
                </div>
              </div>

              <div className="field">
                <label className="label">Prix</label>
                <div className="control">
                    <input className="input" type="text" placeholder="Text input" disabled value={this.props.plat.prix} />


                </div>

              </div>



              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                    <textarea className="textarea" placeholder="Textarea" disabled value={this.props.plat.description}></textarea>
                </div>
              </div>


              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link is-light" onClick={this.handleModifierPlat}>Modifier le plat</button>
                  
                </div>


              </div>
            </div>

            <div className="column">
              <div className="container is-fluid">
                <label className="label subtitle">Vous avez une belle image de votre plat ?</label>
                <div id={styles.dropzone} className="is-paddingless">
                  <img src={this.props.plat.photo} alt="" />
                </div>


              </div>
            </div>
          </form>

        :

          <form id="formulaire_modifier_plat" className="columns">

            <div className="column is-5">
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input 
                  className="input" 
                  type="text" 
                  value={this.state.name}
                  placeholder="Text" onChange={e => this.setState({ name: e.target.value })} />
                </div>
              </div>

              <div className="field">
                <label className="label">Prix</label>
                <div className="control">
                  <input 
                    className="input" 
                    type="number" 
                    placeholder="Prix"
                    value={this.state.prix}
                    onChange={e => this.setState({ prix: e.target.value })} />


                </div>

              </div>



              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                    <textarea 
                      className="textarea" 
                      placeholder="Textarea"
                      value={this.state.description}
                      onChange={e => this.setState({ description: e.target.value })}></textarea>
                </div>
              </div>


              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-link is-light" onClick={this.handleEnvoyerPlat}>Envoyer</button>
                    <button className="button is-link is-light" onClick={e => this.setState({ modifier: false})}>Cancel</button>
                </div>


              </div>
            </div>

            <div className="column">
              <div className="container is-fluid">
                <label className="label subtitle">Vous avez une belle image de votre plat ?</label>
                  <div className={cx(styles.dropzone, "column container")} onDragOver={this.onFileOver} onDrop={this.onFileDrop} >
                    <img src={this.props.plat.photo} alt="" />
                  </div>

                  <br />
                  <div className="column uploads has-text-left subtitle is-7"><strong>Link: <a href={this.state.photo}>{this.state.photo}</a></strong></div>
              </div>
            </div>
          </form>
        
        }

      </div>
    )
  }
}

const mapStateToProps = (state : any) => {
  return {
    authenticated: state.app.authenticated,
    membre: state.app.email,
    categoriesCurrents: state.app.categoriesCurrents,
    restaurantCurrent: state.app.restaurantCurrent,
    platsCurrents: state.app.platsCurrents,
    plat: state.app.plat
  }
}

const mapSDispatchToProps = (dispatch: any) => {
  return {
    modifierPlat: (plat: Object) => dispatch(modifierPlat(plat)),
    resizeImage: (image: any) => dispatch(resizeImage(image)),
    sendPlat: (plat: {}) => dispatch(setPlat(plat)),
  }
}
export default connect(mapStateToProps, mapSDispatchToProps)(FormPlat)