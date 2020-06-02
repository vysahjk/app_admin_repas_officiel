import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './formcreationplat.module.css'
import cx from 'classnames'
import { addPlat, resizeImage } from '../actions'



class FormCreationPlat extends Component<any>{

  state = {
    name: "",
    prix: 0,
    description: "",
    categorie : "",
    restaurant : "",
    restaurateur: "",
    notes: [0],
    photo: "https://f.roocdn.com/images/menus/182890/header-image.jpg?width=327&height=160&auto=webp&format=jpg&fit=crop&v=1567751031"
  }

  handleSubmitPlat = (e: any) => {
    e.preventDefault()
    e.target.reset()
    
    let modal = document.getElementById('modal_page')
    if (modal) {
      modal.style.display = "none"
    }
    this.props.addPlat(this.state, this.props.categoriecurrent)
   
  }

  handleModifierPlat = (e: any) => {
    e.preventDefault()
    console.log(e.target)
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


  render(){
    return (
      <form id="create-plat-form" className={cx(styles.form_creation_plat)} onSubmit={this.handleSubmitPlat}>
        <div className="columns">

          <div className="column is-5">
            <div className="field">
              <label className="label">Name</label>
              <div className="control">
                <input className="input" type="text" placeholder="Text input" onChange={ (e) => this.setState({ name: e.target.value })} />
              </div>
            </div>

            <div className="field">
              <label className="label">Prix</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input" type="number" placeholder="Text input" onChange={(e) => this.setState({ prix: e.target.value })} />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
                <span className="icon is-small is-right">
                  <i className="fas fa-check"></i>
                </span>
              </div>

            </div>



            <div className="field">
              <label className="label">Description</label>
              <div className="control">
                <textarea className="textarea" placeholder="Textarea" onChange={(e) => this.setState({ description: e.target.value })}></textarea>
              </div>
            </div>


            <div className="field is-grouped">
              <div className="control">
                <button className="button is-link" type='submit'>Creer Plat</button>
              </div>
             


            </div>
          </div>

          <div className="column">
            <div className="container is-fluid">
              <label className="label subtitle">Vous avez une belle image pour votre restaurant ?</label>
              <div className={cx(styles.dropzone, "column container")} onDragOver={this.onFileOver} onDrop={this.onFileDrop} >
                <img src={this.state.photo} alt="" />
              </div>


            </div>
          </div>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    authenticated: state.app.authenticated,
    email: state.app.email,
    restos: state.app.restos,
    categoriesCurrents: state.app.categoriesCurrents,
    restaurantCurrent: state.app.restaurantCurrent,
    platsCurrents: state.app.platsCurrents,
    plat: state.app.plat
  }
}

const mapSDispatchToProps = (dispatch:any) => {
  return {
    addPlat: (plat: Object, categorie: string) => dispatch(addPlat(plat, categorie)),
    resizeImage: (image: any) => dispatch(resizeImage(image))
  }
}
export default connect(mapStateToProps, mapSDispatchToProps)(FormCreationPlat)