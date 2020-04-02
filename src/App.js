import React, { useEffect, useReducer, useState, useCallback } from 'react';
import './App.scss';

function App() {



  async function fetchReddit() {
    const response = await fetch(`https://www.reddit.com/r/destiny2/.json?limit=15&after=${state.lastname}`)
    const json = await response.json()

    dispatch({ type: 'setState', value: json.data.children })

  }

  useEffect(() => {
    fetchReddit()
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])


  const initialstate = { children: [], lastname: '', toggle: false, scrolltoTop:false }





  const redditReducer = (state, action) => {
    switch (action.type) {
      case 'setState': {
        return {
          ...state,
          children: [action.value],
          lastname: action.value[action.value.length - 1].data.name
        }
      }
      case 'addState': {
        if (state.toggle) {
          return {
            ...state,
            children: [...state.children, action.value],
            lastname: action.value[action.value.length - 1].data.name,
            toggle: false
          }
        }
        else return state
      }
      case 'setLastName': {
        
        return { ...state, toggle: true }
      }
     
      case 'changeToggle': {
        console.log(action.value)
        return {...state, scrolltoTop:action.value>1800}
      }
    }
  }

  const [state, dispatch] = useReducer(redditReducer, initialstate)

  async function addFetch() {

    const response = await fetch(`https://www.reddit.com/r/destiny2/.json?limit=10&after=${state.lastname}`);
    const json = await response.json()
    dispatch({ type: 'addState', value: json.data.children })

  };

  const handleScroll = () => {

    let temp = window.pageYOffset;
   
    dispatch({type:'changeToggle', value:temp})

    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) 
    
    
    return;
    dispatch({ type: 'setLastName' })

  }
  let i =0;
  let number= 0;
  if (state.toggle & state.children.length > 0) {
    addFetch(state.lastname)
  }

  return (
    <div className="App">
       {state.scrolltoTop&&<div  onClick={()=> window.scrollTo(0, 0) } className={`hiddenbtn`}><span>BACK TO TOP</span></div>}
      {state.children.length == 0
        ? "Loading..."
        : state.children.map(el =>

          <div >
               {console.log(el)}
            {el.map(el => <div>
           
             <div style={{display:'none'}}> {i++} {number=el.data.ups/1000}</div>
              {el.data.domain !== 'youtube.com' ?
                <div className="block_wrap">
                  <div style={{ width: '50px' }}>
       
                    {number*1000>=1000?
                    `${number.toFixed(1)}к`: number*1000}
                  </div>
                  {el.data.is_video ?

                    <div className='img_vide_wrapp'>

                      <div className='title'>  <a href={`https://www.reddit.com/${el.data.permalink}`}>{el.data.title} </a> </div>

                      <div> <video controls="controls" loop="loop" autoPlay muted autoplay="autoplay" >
                        <source src={el.data.media.reddit_video.fallback_url} />
                        <source src='' />

                      </video></div>


                    </div>
                    :

                    <>
                      {el.data.is_self

                        ?
                        <div className='img_vide_wrapp'>
                          <div className='title'>   
                          
                          <a className={i<=2&&`modderlink`} href={`https://www.reddit.com/${el.data.permalink}`}>{el.data.title} </a>
                          
                         
                          </div>
                        </div>

                        :
                        <div className='img_vide_wrapp'>

                          <div className='title'>
                           
                              <a href={`https://www.reddit.com/${el.data.permalink}`}>{el.data.title} </a>


                          </div>
                          <div> {el.data.domain==='imgur.com'?
                          <>
                          <img src={`https://i.imgur.com/${el.data.url.slice(18)}.png`} />
                          {console.log(el.data.url.slice(18))}
                          </>
                          : <img src={el.data.url} />} </div>

                        </div>
                      }

                    </>
                  }
                </div>
                : null
              }
           
            </div>

            )}
  
          </div>
        )


      }

    </div>
  );
}

export default App;
