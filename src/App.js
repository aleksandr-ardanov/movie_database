import './App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import {Pagination} from 'antd';
import CreateMovie from './components/CreateMovie';
import EditMovie from './components/EditMovie';
import Filters from './components/Filters';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';

function App() {

  const linkStyle = {
    margin: "1rem",
    "font-size": "2rem",
    textDecoration: "none",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [movies,setMovies] = useState([]) 
  const [data,setData] = useState([])
  const onChange = page => {
    setCurrentPage(page);
  };
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = data.slice(indexOfFirstMovie, indexOfLastMovie);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_DOMAIN}/movies?api_key=${process.env.REACT_APP_API_KEY}`)
    .then(res => {
      setMovies(res.data.movies)
    })
    .catch(err => {
      console.log(err.response)
    })
  },[])

  useEffect(() => {
    const filtered = [...movies]
    setData(filtered)
  },[movies])
  
  const noMovies  = (
    <div>
      <h1>no movies to display</h1>
    </div>
    )
    
  function toTime(time) {
    let hours   = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = time - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }
  
  function hmsToSecondsOnly(str) {
    let p = str.split(':'),
        s = 0, m = 1;
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}

  const list = currentMovies.map(movie => {
    return(
      <CardDiv className="movie" key={movie.movie_id}>
        <div className="image">
          <h1>{movie.title}</h1>
        </div>
			  <div className="info">
          <p>Genre: {movie.genre}</p>
          <p>Year: {movie.year}</p>
          <p>Run time (hh:mm:ss): {toTime(movie.run_time)}</p>
          <p>Rating: {movie.rating}</p>
          {movie.main_actors.length !== 0 ? <p>Main Actors: {movie.main_actors}</p> : ''}
          <div className='ownerButtons'>
					<Link to={`/edit/${movie.movie_id}`}><Button color="primary" variant= "contained">Edit/Delete</Button></Link> 
				  </div>
        </div>
      </CardDiv>
  )})

  return (
    <div className="App">
      <header>
        <h1>Movies</h1>
        <div className='headerLinks'>
        <Link style = {linkStyle} to="/">Home</Link>
        <Link style = {linkStyle} to="/create">Add a new movie</Link>
        </div>
      </header>
      <Switch>
        {currentMovies.map(movie => {
          return (<Route key = {movie.movie_id} path={`/edit/${movie.movie_id}`}>
                    <EditMovie movie={movie} movies = {movies} setMovies = {setMovies} toTime = {toTime} hmsToSecondsOnly = {hmsToSecondsOnly}/>
                  </Route>)
        })}
        <Route path="/create">
          <CreateMovie movies = {movies} setMovies = {setMovies} hmsToSecondsOnly = {hmsToSecondsOnly}/>
        </Route>
        <Route path="/">
          <Filters movies = {movies} data = {data} setData = {setData} setCurrentPage = {setCurrentPage}/>
          <div className = 'movies'>
          {data.length === 0 ? noMovies : list}
          </div>
          <section className="pagination">
              <Pagination
                onChange={onChange}
                current={currentPage}
                pageSize={itemsPerPage}
                total={data.length}
                showSizeChanger={false}
              />
          </section>
        </Route>
    </Switch>
    </div>
  );
}

const CardDiv = styled.div`
  h1{
    transform: translateY(50%);
    text-align: center;
  	color:white;
  }
  .ownerButtons{
    margin:5%
  }
	border:2px solid black;
	display:flex;
	flex-direction:column;
	width:25%;
	height:auto;
	margin: 2% 3%;
	border-radius:14px;
	background-color:black;
	padding-bottom:2px;
	position:relative;
	&:hover{
		.info{
			opacity:.9;
		};
	};
	
	@media (max-width:991px){
		width:40%;
		img{
			height:250px;
		};
		.image h1{
		font-size:3vw;
		};
	};
	@media (max-width:470px){
		width:60%;
		.cards{
			flex-direction:column;
			align-items: center;
			justify-content: center;
			flex-wrap: nowrap;
		};
		img{
			height:200px;
		};
		.image h1{
		font-size:4vw;
		};
	};
`


export default App;
