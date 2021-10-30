import React, { useEffect, useState } from 'react'
import { csv } from 'csvtojson'

function Index() {

    const [searchTerm, setSearchTerm] = useState('')
    const [players, setPlayers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(false)
    const [player, setSelectedPlayer] = useState({})

    const height = window.innerHeight

    useEffect(() => {
        setLoading(true)
        const playersCSVLoad = async () => {
            const res = await fetch('data.csv');
            const text = await res.text();
            const json = await csv().fromString(text);
            let data = json
            if (data.length > 0) {
                setPlayers(data)
                setLoading(false)
            } else {
                console.log('no data')
                setLoading(false)
            }
            return data
        }
        playersCSVLoad()

        return () => {
            playersCSVLoad()
        }
    }, [])

    useEffect(() => {
        if (searchTerm === '') {
            setSearchResults([])
        } else if (searchTerm !== '') {
            const filteredPlayers = players.filter((player) => {
                return Object.values(player.Name + player.Nationality + player.JerseyNumber.toString() + player.Club).join("").toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase().trim())
            })
            setSearchResults(filteredPlayers)
        } else {
            setSearchResults([])
        }
    }, [searchTerm, players])

    const SelectAPlayer = (player) => {
        setSelectedPlayer(player)
        setSelected(true)
    }

    const ClearSelected = () => {
        setSelectedPlayer({})
        setSelected(false)
    }

    return (
        <>
            {
                loading ? <>
                    Loading CSV ....
                </> :
                    <div>
                        <div className="left" style={{ float: 'left', width: '50%' }}>
                            <div className='image' style={{ background: "url(../assets/fifa-19.jpg)", height: height, backgroundSize: "cover", backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
                        </div>
                        <div className='right' style={{ float: 'right', width: '50%', paddingTop: '320px' }}>
                        {selected ?
                             <div style={{ marginLeft: '120px' }} >
                                <h2 onClick={() => ClearSelected()}>Go Home </h2>
                                 <br/><br/>

                                <h3>Name : {player.Name} </h3><br/>
                                <b>Nationality :</b> {player.Nationality} <br/>
                                <b>Age :</b> {player.Age} <br/>
                                <b>Wage :</b> {player.Wage} <br/>
                                <b>Overall :</b> {player.Overall} <br/>
                                <b>Value :</b> {player.Value} <br/>
                                <b>Position :</b> {player.Position} <br/>
                                <b>Club :</b> {player.Club} <br/>
                                <b>Valid Until :</b> {player.ContractValidUntil} <br/>
                                <b>Jesery Number :</b> {player.JerseyNumber} <br/>
                                <b>Joined :</b> {player.Joined} <br/>
                            </div>
                            :
                                <div style={{ marginLeft: '120px' }} >
                                    <div>
                                        <h2>FIFA 19 (Stadium FC Search)</h2>
                                        <p className=''><b>You can search with most of the attributes in the csv file</b></p>
                                    </div>
                                    <div className=''>
                                        <input style={{ fontSize: "30px" }} type="text" placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value.toString())} />
                                    </div>
                                    {
                                        searchResults.length === 0 && searchTerm !== '' ? <div className=''>
                                            <h1 className=''>Not found !</h1>
                                        </div> : searchResults.map((player, index) => (
                                            // Name as the key is not best.
                                            <div key={index} onClick={() => SelectAPlayer(player)}>
                                                <h1 className=''>{player.Name}</h1>
                                            </div>
                                        ))

                                    }
                                </div>
                            }
                        </div>
                    </div>
            }
        </>
    )
}

export default Index
