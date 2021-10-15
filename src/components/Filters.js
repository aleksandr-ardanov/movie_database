import React, { useEffect, useState } from 'react';
import styled from 'styled-components'

const StyleSearchBar = styled.input`
    border:1px solid #221e1d; 
    width:20%;
    padding:1%;
    margin:2%;
    @media(max-width:991px){
        width:60%;
    }
`

const Filters = props => {
    const {movies, data, setData,setCurrentPage} = props
    const initialSel = {
        sortBySelected: '',
        searched:'',

        action: true,
        comedy: true,
        drama: true,
        fantasy: true,
        horror: true,
        musical: true,
        romance: true,

        g:true,
        pg:true,
        pg13:true,
        r:true,
        nc17:true
    }
    const [selected,setSelected] = useState(initialSel)
    const {sortBySelected,searched,action,comedy,drama,fantasy,horror,musical,romance,g,pg,pg13,r,nc17} = selected

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target
        const valueToUse = type === 'checkbox' ? checked : value
            setSelected({...selected,[name] : valueToUse})
    }

    const filterByData = (typeOfKey,order) => {
        if (typeOfKey !== ''){
            const ret = []
            let arr_key_val = data.map(d => {
                return d[typeOfKey]
            })

            if (typeOfKey === 'year' || typeOfKey === 'run_time'){
                arr_key_val = []
                let s = new Set()
                data.forEach(d => {
                    if (!s.has(d[typeOfKey])){
                        s.add(d[typeOfKey])
                    }
                })
                s.forEach(ent => arr_key_val.push(ent))
            }

            if (order === 'asc' && typeOfKey === 'title'){
                arr_key_val.sort()
            }
            else if (order === 'desc' && typeOfKey === 'title'){
                arr_key_val.sort()
                arr_key_val.reverse()
            }
            else if (order === 'asc' && typeOfKey === 'rating'){
                arr_key_val = ['G','PG','PG-13','R','NC-17']
            }
            else if (order === 'desc' && typeOfKey === 'rating'){
                arr_key_val = ['NC-17','R','PG-13','PG','G']
            }
            else if (order === 'asc' && (typeOfKey === 'year' || typeOfKey === 'run_time')){
                arr_key_val.sort((a,b) => a-b)
            }
            else if (order === 'desc' && (typeOfKey === 'year' || typeOfKey === 'run_time')){
                arr_key_val.sort((a,b) => b-a)
            }

            for (let i = 0;i<arr_key_val.length;i++){
                for (let j = 0;j<data.length;j++){
                    if (data[j][typeOfKey] === arr_key_val[i]){
                        ret.push(data[j])
                    }
                }
            }
            setData(ret)
        }
    }
    
    useEffect(() => {
        const middle = []
        const returned = []
        const genres = []
        const ratings = []
        const filtered = [...movies]
        if (action){
            genres.push('action')
        }
        if (comedy){
            genres.push('comedy')
        }
        if (drama){
            genres.push('drama')
        }
        if (fantasy){
            genres.push('fantasy')
        }
        if (horror){
            genres.push('horror')
        }
        if (musical){
            genres.push('musical')
        }
        if (romance){
            genres.push('romance')
        }
        if (g){
            ratings.push('G')
        }
        if (pg){
            ratings.push('PG')
        }
        if (pg13){
            ratings.push('PG-13')
        }
        if (r){
            ratings.push('R')
        }
        if (nc17){
            ratings.push('NC-17')
        }
        for (let i = 0; i<filtered.length;i++){
            for (let j=0;j<genres.length;j++)
            if (filtered[i].genre === genres[j]){
                middle.push(filtered[i])
            }
        }
        for (let i = 0; i<middle.length;i++){
            for (let j=0;j<ratings.length;j++)
            if (middle[i].rating === ratings[j]){
                returned.push(middle[i])
            }
        }
        if (searched !== ''){
            let input = JSON.parse(JSON.stringify(searched));
            input = input.toLowerCase().trim();
            let allTitles = [...returned];
            let filteredMovies = []
            for (let i=0; i<allTitles.length ;i++){
                if (allTitles[i].title.toLowerCase().includes(input) || allTitles[i].main_actors.toString().toLowerCase().includes(input)){
                    filteredMovies.push(allTitles[i].movie_id)
                }
            }
            let ret = filteredMovies.map(movie => {
                const [a] = allTitles.filter(t => t.movie_id === movie)
                return a
            })
            setData(ret)
            setCurrentPage(1)
        }
        else{
            setData(returned)
            setCurrentPage(1)
        }
    },[setData,setCurrentPage,searched,movies,action,comedy,drama,fantasy,horror,musical,romance,g,pg,pg13,r,nc17])

    const clean = () => {
        setSelected(initialSel)
        document.querySelector('#searchBar').value = ''
        setData(movies)
    }
    
    return (
        <div className = 'filters'>
            <StyleSearchBar className='search resetAll' id='searchBar' name = 'searched' value = {searched} onChange = {handleChange} type='text' placeholder=' Search for movie... &#128270;' />
            <div className = "filtersSort">
                <select className = "fSort" value = {sortBySelected} onChange = {handleChange} name='sortBySelected' type='text'>
                <option value = ''>Sort By</option>
                <option value = 'title'>Title</option>
                <option value = 'rating'>Rating</option>
                <option value = 'year'>Year</option>
                <option value = 'run_time'>Run time</option>
            </select>
            <button className = "fButton" onClick = {() => filterByData(sortBySelected,'asc')}>Filter Asc ↑</button>
            <button className = "fButton" onClick = {() => filterByData(sortBySelected,'desc')}>Filter Desc ↓</button>
            <button className = "fButton" onClick={() => clean()}type="button">Reset</button>
            </div>
            <h2>Select Genre</h2>
            <div className='genres'>
                <label>
                    <input 
                    className = "check_all"
                    name='action' 
                    type='checkbox'
                    checked={action}
                    onChange={handleChange}
                    />Action
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='comedy' 
                    type='checkbox'
                    checked={comedy}
                    onChange={handleChange}
                    />Comedy
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='drama' 
                    type='checkbox'
                    checked={drama}
                    onChange={handleChange}
                    />Drama
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='fantasy' 
                    type='checkbox'
                    checked={fantasy}
                    onChange={handleChange}
                    />Fantasy
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='horror' 
                    type='checkbox'
                    checked={horror}
                    onChange={handleChange}
                    />Horror
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='musical' 
                    type='checkbox'
                    checked={musical}
                    onChange={handleChange}
                    />Musical
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='romance' 
                    type='checkbox'
                    checked={romance}
                    onChange={handleChange}
                    />Romance
                </label>
            </div>
            <h2>Select Rating</h2>
            <div className='rating'>
                <label>
                    <input 
                    className = "check_all"
                    name='g' 
                    type='checkbox'
                    checked={g}
                    onChange={handleChange}
                    />G
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='pg' 
                    type='checkbox'
                    checked={pg}
                    onChange={handleChange}
                    />PG
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='pg13' 
                    type='checkbox'
                    checked={pg13}
                    onChange={handleChange}
                    />PG-13
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='r' 
                    type='checkbox'
                    checked={r}
                    onChange={handleChange}
                    />R
                </label>
                <label>
                    <input 
                    className = "check_all"
                    name='nc17' 
                    type='checkbox'
                    checked={nc17}
                    onChange={handleChange}
                    />NC-17
                </label>
            </div>
        </div>
    )
}

export default Filters;


