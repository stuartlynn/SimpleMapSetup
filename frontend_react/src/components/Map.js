import React from "react";
import mapboxgl from '@carto/mapbox-gl'
import mapboxcss from '@carto/mapbox-gl/dist/mapbox-gl.css'

//const mapboxgl = window.mapboxgl

class Map extends React.Component{

  render(){
    return(
      <div style={{width:'100%',
                   height:'100%',
                   position:'relative',
                   left:'0px',
                   right:'0px'}}
        ref='map'>
        {this.renderChildren()}
      </div>
    )
  }

  shouldComponentUpdate(){
    return true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.extent !== this.props.extent){
      this.fitMapToExtent(nextProps.extent)
    }
  }

  fitMapToExtent(extent){
      this.state.map.fitBounds(
        [[extent[0],extent[1]],
         [extent[2],extent[3]]
        ]
      )
  }

  componentDidMount(){
      mapboxgl.accessToken = this.props.mapboxGLToken
      let map = new mapboxgl.Map({
          container: this.refs.map,
          style: this.props.basemap,
          center: [-73.9449975,40.645244],
          zoom: 11.5,
      });
      window.map = map
      this.setState({
        map: map
      })
      map.on('load',()=>{
        if(this.props.extent){
          this.fitMapToExtent(this.props.extent)
        }
      })
  }

  renderChildren() {
    if(this.state && this.state.map){
      return React.Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          map: this.state.map
        })
      })
    }
  }
}


export default Map
