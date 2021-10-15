import axios from 'axios';
import {useState } from 'react';
import { useHistory } from 'react-router';

const EditMovie = (props) => {
    const {movie, setMovies, movies, hmsToSecondsOnly, toTime} = props
    const timeFormat = {...movie, run_time:(toTime(movie.run_time))}
    const [mov,setMov] = useState(timeFormat)
    const history = useHistory()
    const handleChange = e => {
        let changed = e.target.value
        if (e.target.type === 'number' && changed !== ''){
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
        setMov({
          ...mov,
          [e.target.name]:changed
        })
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        let ret = []
        for (let i = 0; i<mov.main_actors.length; ++i){
          ret.push(mov.main_actors[i].trim())
        }
        mov.main_actors = ret
        mov.run_time = hmsToSecondsOnly(mov.run_time)
        axios.put(`${process.env.REACT_APP_DOMAIN}/movies/${mov.movie_id}?api_key=${process.env.REACT_APP_API_KEY}`, mov)
          .then(res => {
            const filtered = movies.filter(mo => mo.movie_id !== mov.movie_id)
            setMovies([...filtered,res.data])
            history.push('/')
          })
          .catch(err => {
            console.log(err.response)
          })
      }
    const {title,genre,year,run_time,rating,main_actors} = mov;

    const deleteMovie = () => {
        axios.delete(`${process.env.REACT_APP_DOMAIN}/movies/${timeFormat.movie_id}?api_key=${process.env.REACT_APP_API_KEY}`)
        .then(res => {
            setMovies(movies.filter(mov => mov.movie_id !== timeFormat.movie_id))
            console.log('deleted')
            history.push('/')
        })
        .catch(err => {
          console.log(err.response)
        })
      }

    return (
        <div className="editMovie">
        <h1>
          Edit Movie
        </h1>
        <form onSubmit = {handleSubmit} className = "editMovieForm createMovieForm">
            <h2>Title</h2>
              <input className = "childCreate" value = {title} onChange = {handleChange} name='title' type='text'/>
            <h2>Genre</h2>
              <select className = "childCreate" value = {genre} onChange = {handleChange} name='genre' type='text'>
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
              <input className = "childCreate" value = {year} onChange = {handleChange} name='year' type="number" placeholder = 'min 1888'/>
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
          <input type="submit" className="editMovieBtn submitMovieBtn childCreate" value="Edit"/>
          <input type="button" onClick = {() => setMov(timeFormat)} className="submitMovieBtn cancelMovieBtn childCreate" value="Cancel"/>
          <button className="childCreate deleteMovieButton" onClick={() => deleteMovie()}>Delete Movie</button> 
        </form>
      </div>
    )
}
  
export default EditMovie;
  