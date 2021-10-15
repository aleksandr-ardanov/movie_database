import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router';

const CreateMovie = (props) => {
    const {movies, setMovies, hmsToSecondsOnly} = props
    const newMovie = {
      title: '',
      genre: '',
      year: '',
      run_time: '',
      rating: '',
      main_actors: [],
    }
    const [movie, setMovie] = useState(newMovie)
    const {title,genre,year,run_time,rating,main_actors} = movie;
    const history = useHistory()

    const handleChange = e => {
      let changed = e.target.value
      if (e.target.type === 'number'){
        changed = parseInt(changed)
      }
      else if (e.target.name === 'main_actors'){
        if (e.target.value !== ''){
          changed = changed.split(',')
        }
        else{
          changed = []
        }
      }
      setMovie({
        ...movie,
        [e.target.name]:changed
      })
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      let ret = []
      for (let i = 0; i<movie.main_actors.length; ++i){
        ret.push(movie.main_actors[i].trim())
      }
      movie.main_actors = ret
      movie.run_time = hmsToSecondsOnly(movie.run_time)
      axios.post(`${process.env.REACT_APP_DOMAIN}/movies?api_key=${process.env.REACT_APP_API_KEY}`, movie)
        .then(res => {
          setMovies([...movies,res.data])
          history.push('/')
        })
        .catch(err => {
          console.log(err.response)
        })
    }

    return (
      <div className="createMovie">
        <h1>
          Create Movie
        </h1>
        <form onSubmit = {handleSubmit} className = "createMovieForm">
            <h2>Title</h2>
              <input className = "childCreate" maxlength = '100' value = {title} onChange = {handleChange} name='title' type='text' placeholder = "max length 100"/>
            <h2>Genre</h2>
              <select className = "childCreate"  value = {genre} onChange = {handleChange} name='genre' type='text'>
                <option value = ''>Select Genre</option>
                <option value = 'action'>Action</option>
                <option value = 'comedy'>Comedy</option>
                <option value = 'drama'>Drama</option>
                <option value = 'fantasy'>Fantasy</option>
                <option value = 'horror'>Horror</option>
                <option value = 'musical'>Musical</option>
                <option value = 'romance'>Romance</option>
              </select>
            <h2>Year</h2>
              <input className = "childCreate" min='1888' value = {year} onChange = {handleChange} name='year' type="number" placeholder = 'min 1888'/>
            <h2>Run time</h2>
              <input className = "childCreate" value = {run_time} onChange = {handleChange} name='run_time' type="text" placeholder = "format hh:mm:ss"/>
            <h2>Rating</h2>
              <select className = "childCreate" value = {rating} onChange = {handleChange} name='rating'>
                <option value = ''>Select Rating</option>
                <option value = 'G'>G</option>
                <option value = 'PG'>PG</option>
                <option value = 'PG-13'>PG-13</option>
                <option value = 'R'>R</option>
                <option value = 'NC-17'>NC-17</option>
              </select>
            <h2>Main Actors</h2>
              <input className = "childCreate" value = {main_actors} onChange = {handleChange} name='main_actors' type='text' placeholder = 'separate by comma'/>
          <input type="submit" className="submitMovieBtn childCreate" value="Add"/>
          <input type="button" onClick = {() => setMovie(newMovie)} className="submitMovieBtn clearMovieBtn childCreate" value="Clear"/>
        </form>
      </div>
    );
  }
  
  export default CreateMovie;
  

